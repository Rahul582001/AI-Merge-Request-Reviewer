import { Injectable } from '@nestjs/common';
import { commonMessages } from 'src/common/messages/common.messages';
import { InternalServerErrorResponse } from 'src/common/utils/Responses.util';

@Injectable()
export class GithubService {
  async github(data: any) {
    try {
      console.log(data);
      return 'PR webhook event triggered';
    } catch (error: unknown) {
      return InternalServerErrorResponse(
        error instanceof Error ? error.message : String(error),
        commonMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
