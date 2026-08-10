import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ReviewCommentEntity } from './entities/review-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, ReviewCommentEntity])],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
