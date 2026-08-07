import { Body, Controller, Post } from '@nestjs/common';
import { GithubService } from './github.service';
import { InternalServerErrorResponse } from 'src/common/utils/Responses.util';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { commonMessages } from 'src/common/messages/common.messages';

@ApiTags('GITHUB')
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}
  @Post('webhook')
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
  async github(@Body() data: any) {
    try {
      return await this.githubService.github(data);
    } catch (error: unknown) {
      return InternalServerErrorResponse(
        error instanceof Error ? error.message : String(error),
        commonMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
