import { Controller } from '@nestjs/common';
import { PullRequestService } from './pull-request.service';

@Controller('pull-request')
export class PullRequestController {
  constructor(private readonly pullRequestService: PullRequestService) {}
}
