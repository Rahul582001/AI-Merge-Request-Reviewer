import { Module } from '@nestjs/common';
import { PullRequestService } from './pull-request.service';
import { PullRequestController } from './pull-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PullRequestEntity } from './entities/pull-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PullRequestEntity])],
  controllers: [PullRequestController],
  providers: [PullRequestService],
})
export class PullRequestModule {}
