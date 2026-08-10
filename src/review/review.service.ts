import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReviewEntity } from './entities/review.entity';
import { ReviewCommentEntity } from './entities/review-comment.entity';

import {
  InternalServerErrorResponse,
  SuccessResponse,
} from 'src/common/utils/Responses.util';

import { commonMessages } from 'src/common/messages/common.messages';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,

    @InjectRepository(ReviewCommentEntity)
    private readonly reviewCommentRepository: Repository<ReviewCommentEntity>,
  ) {}

  async saveReview(pullRequestId: number, reviewResponse: any) {
    try {
      const { summary, overallScore, status, comments } = reviewResponse;

      let review = await this.reviewRepository.findOne({
        where: {
          pullRequestId,
        },
      });

      if (review) {
        review.summary = summary;
        review.overallScore = overallScore;
        review.status = status;

        review = await this.reviewRepository.save(review);

        await this.reviewCommentRepository.delete({
          reviewId: review.id,
        });
      } else {
        review = await this.reviewRepository.save({
          pullRequestId,
          summary,
          overallScore,
          status,
        });
      }

      if (comments?.length) {
        const reviewComments = comments.map((comment: any) => ({
          reviewId: review.id,
          fileName: comment.fileName,
          lineNumber: comment.lineNumber,
          severity: comment.severity,
          comment: comment.comment,
          suggestedCode: comment.suggestedCode,
        }));

        await this.reviewCommentRepository.save(reviewComments);
      }

      return SuccessResponse(
        review.id,
        commonMessages.REVIEW_SAVED_SUCCESSFULLY,
      );
    } catch (error) {
      return InternalServerErrorResponse(
        error instanceof Error ? error.message : String(error),
        commonMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
