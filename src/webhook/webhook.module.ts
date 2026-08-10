import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { GithubModule } from 'src/github/github.module';

@Module({
  imports: [GithubModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
