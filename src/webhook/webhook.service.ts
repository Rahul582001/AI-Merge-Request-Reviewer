import { Injectable } from '@nestjs/common';
import { commonMessages } from 'src/common/messages/common.messages';
import { InternalServerErrorResponse } from 'src/common/utils/Responses.util';
import { GithubService } from 'src/github/github.service';

@Injectable()
export class WebhookService {
  constructor(private readonly githubService: GithubService) {}
  async processGithubWebhook(event: string, payload: any) {
    try {
      switch (event) {
        case 'pull_request':
          return await this.githubService.handlePullRequestEvent(payload);

        case 'ping':
          return {
            message: 'GitHub webhook connected successfully.',
          };

        default:
          return {
            message: `Event '${event}' is not supported.`,
          };
      }
    } catch (error: unknown) {
      return InternalServerErrorResponse(
        error instanceof Error ? error.message : String(error),
        commonMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
