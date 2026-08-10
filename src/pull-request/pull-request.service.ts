import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PullRequestEntity } from './entities/pull-request.entity';
import { commonMessages } from 'src/common/messages/common.messages';
import {
  InternalServerErrorResponse,
  SuccessResponse,
} from 'src/common/utils/Responses.util';

@Injectable()
export class PullRequestService {
  constructor(
    @InjectRepository(PullRequestEntity)
    private readonly pullRequestRepository: Repository<PullRequestEntity>,
  ) {}

  async savePullRequest(repositoryId: number, pullRequest: any) {
    try {
      const { id, number, title, body, state, merged, user, head, base } =
        pullRequest;
      const existingPullRequest = await this.pullRequestRepository.findOne({
        where: {
          githubPrId: id,
        },
      });

      if (existingPullRequest) {
        existingPullRequest.title = title;
        existingPullRequest.description = body;
        existingPullRequest.state = state;
        existingPullRequest.merged = merged;
        existingPullRequest.sourceBranch = head.ref;
        existingPullRequest.targetBranch = base.ref;

        await this.pullRequestRepository.save(existingPullRequest);

        return SuccessResponse(
          existingPullRequest.id,
          commonMessages.PR_UPDATED_SUCCESSFULLY,
        );
      }

      const savedPullRequest = await this.pullRequestRepository.save({
        githubPrId: id,
        repositoryId,
        prNumber: number,
        title,
        description: body,
        author: user.login,
        sourceBranch: head.ref,
        targetBranch: base.ref,
        state,
        merged,
      });

      return SuccessResponse(
        savedPullRequest.id,
        commonMessages.PR_SAVED_SUCCESSFULLY,
      );
    } catch (error) {
      return InternalServerErrorResponse(
        error instanceof Error ? error.message : String(error),
        commonMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
