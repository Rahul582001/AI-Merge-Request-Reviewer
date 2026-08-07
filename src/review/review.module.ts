import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ReviewCommentEntity } from './entities/review-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, ReviewCommentEntity])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
