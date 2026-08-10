import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RepositoryService } from 'src/repository/repository.service';
import { PullRequestService } from 'src/pull-request/pull-request.service';
import { LlmService } from 'src/llm/llm.service';
import { ReviewService } from 'src/review/review.service';
import { commonMessages } from 'src/common/messages/common.messages';
import { InternalServerErrorResponse } from 'src/common/utils/Responses.util';

@Injectable()
export class GithubService {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly pullRequestService: PullRequestService,
    private readonly llmService: LlmService,
    private readonly reviewService: ReviewService,
  ) {}

  async handlePullRequestEvent(payload: any) {
    try {
      const { action, repository, pull_request } = payload;
      console.log('pull_request: ', pull_request);
      console.log('repository: ', repository);
      console.log('action: ', action);

      // Process only the events that require a new AI review
      if (!['opened', 'synchronize', 'reopened'].includes(action)) {
        return {
          message: `Ignoring ${action} event`,
        };
      }

      /*
       * STEP 1
       * Save repository information
       */
      const repositoryResponse =
        await this.repositoryService.saveRepository(repository);

      const repositoryId = repositoryResponse.data;

      /*
       * STEP 2
       * Save pull request information
       */
      const pullRequestResponse = await this.pullRequestService.savePullRequest(
        repositoryId,
        pull_request,
      );

      const pullRequestId = pullRequestResponse.data;

      /*
       * STEP 3
       * Get changed files from GitHub
       */
      const changedFiles = await this.getChangedFiles(
        repository.owner.login,
        repository.name,
        pull_request.number,
      );

      /*
       * STEP 4
       * Send changed files to Ollama
       */
      const aiReviews: any = await this.llmService.reviewFiles(changedFiles);

      /*
       * STEP 5
       * Combine file-level AI reviews
       */
      const finalReview = this.combineReviews(aiReviews);

      /*
       * STEP 6
       * Save AI review and comments
       */
      const reviewResponse = await this.reviewService.saveReview(
        pullRequestId,
        finalReview,
      );

      /*
       * STEP 7
       * Post AI review to GitHub
       */
      await this.postReviewComment(
        repository.owner.login,
        repository.name,
        pull_request.number,
        finalReview,
      );

      /*
       * STEP 8
       * Return result
       */
      return {
        message: 'Pull request reviewed successfully',
        pullRequestId,
        reviewId: reviewResponse.data,
      };
    } catch (error: unknown) {
      return InternalServerErrorResponse(
        error instanceof Error ? error.message : String(error),
        commonMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getChangedFiles(owner: string, repo: string, pullNumber: number) {
    try {
      const response = await axios.get(
        `${process.env.GITHUB_API}/repos/${owner}/${repo}/pulls/${pullNumber}/files`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
          },
        },
      );

      return response.data
        .filter((file: any) => file.patch)
        .map((file: any) => ({
          fileName: file.filename,
          language: file.filename.split('.').pop() ?? 'unknown',
          patch: file.patch,
          additions: file.additions,
          deletions: file.deletions,
        }));
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  private combineReviews(reviews: any[]) {
    const comments: any[] = [];

    let totalScore = 0;

    for (const review of reviews) {
      totalScore += review.overallScore ?? 0;

      if (review.comments?.length) {
        comments.push(...review.comments);
      }
    }

    const overallScore =
      reviews.length > 0 ? Math.round(totalScore / reviews.length) : 0;

    const summaries = reviews.map((review) => review.summary).filter(Boolean);

    return {
      summary:
        summaries.length > 0
          ? summaries.join(' ')
          : 'No issues found in the reviewed changes.',

      overallScore,

      status: 'COMPLETED',

      comments,
    };
  }

  async postReviewComment(
    owner: string,
    repo: string,
    pullNumber: number,
    review: any,
  ) {
    try {
      let commentBody = `## 🤖 AI Merge Request Review

**Overall Score:** ${review.overallScore}/100

### Summary

${review.summary}

`;

      if (review.comments?.length) {
        commentBody += `### Findings

`;

        review.comments.forEach((comment: any, index: number) => {
          commentBody += `### ${index + 1}. ${comment.severity}

**File:** \`${comment.fileName}\`

**Line:** ${comment.lineNumber}

${comment.comment}

`;

          if (comment.suggestedCode) {
            commentBody += `**Suggested Code:**

\`\`\`
${comment.suggestedCode}
\`\`\`

`;
          }
        });
      } else {
        commentBody += `### ✅ No Issues Found

No code issues were identified in the changed files.
`;
      }

      const response = await axios.post(
        `${process.env.GITHUB_API}/repos/${owner}/${repo}/issues/${pullNumber}/comments`,
        {
          body: commentBody,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}
