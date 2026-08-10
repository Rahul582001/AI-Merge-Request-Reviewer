import { Module } from '@nestjs/common';
import { PullRequestService } from './pull-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PullRequestEntity } from './entities/pull-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PullRequestEntity])],
  providers: [PullRequestService],
  exports:[PullRequestService]
})
export class PullRequestModule {}
