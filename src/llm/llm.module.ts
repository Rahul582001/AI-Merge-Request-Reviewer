import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [ReviewModule],
  providers: [LlmService],
  exports:[LlmService]
})
export class LlmModule {}
