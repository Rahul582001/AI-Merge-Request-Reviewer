import { Body, Controller, Post, Headers } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InternalServerErrorResponse } from 'src/common/utils/Responses.util';
import { commonMessages } from 'src/common/messages/common.messages';

@ApiTags('WEBHOOK')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  @Post('github')
  @ApiOperation({
    summary: 'Process GitHub Merge Request',
    description: 'Receives GitHub merge request details and processes them.',
  })
  @ApiBody({
    description: 'GitHub Merge Request Payload',
  })
  @ApiResponse({
    status: 200,
    description: 'Merge Request processed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  async processGithubWebhook(
    @Headers('x-github-event') event: string,
    @Body() payload: Record<string, any>,
  ) {
    try {
      return this.webhookService.processGithubWebhook(event, payload);
    } catch (error: unknown) {
      return InternalServerErrorResponse(
        error instanceof Error ? error.message : String(error),
        commonMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
