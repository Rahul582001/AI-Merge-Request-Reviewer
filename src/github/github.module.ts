import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { PullRequestModule } from 'src/pull-request/pull-request.module';
import { LlmModule } from 'src/llm/llm.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [RepositoryModule, PullRequestModule, LlmModule, ReviewModule],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
