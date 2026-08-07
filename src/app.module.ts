import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { RepositoryModule } from './repository/repository.module';
import { PullRequestModule } from './pull-request/pull-request.module';
import { ReviewModule } from './review/review.module';
import { GithubModule } from './github/github.module';
import { WebhookModule } from './webhook/webhook.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    RepositoryModule,
    PullRequestModule,
    ReviewModule,
    GithubModule,
    WebhookModule,
    LlmModule,
  ],
})
export class AppModule {}
