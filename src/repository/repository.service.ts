import { Injectable } from '@nestjs/common';
import { commonMessages } from 'src/common/messages/common.messages';
import {
  InternalServerErrorResponse,
  SuccessResponse,
} from 'src/common/utils/Responses.util';
import { RepositoryEntity } from './entities/repository.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PullRequestService } from 'src/pull-request/pull-request.service';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(RepositoryEntity)
    private readonly repositoryRepository: Repository<RepositoryEntity>,
  ) {}
  async saveRepository(repoInfo: any) {
    try {
      const { id, name, owner, default_branch } = repoInfo;

      const existingRepository = await this.repositoryRepository.findOne({
        where: {
          githubRepoId: id,
        },
      });

      if (existingRepository) {
        return SuccessResponse(
          existingRepository.id,
          commonMessages.ALREADY_EXISTS,
        );
      }

      const savedRepository = await this.repositoryRepository.save({
        githubRepoId: id,
        owner: owner.login,
        name,
        defaultBranch: default_branch,
      });
      console.log('savedRepositoryID: ', savedRepository.id);

      return SuccessResponse(
        savedRepository.id,
        commonMessages.REPO_DATA_SAVED_SUCESSFULLY,
      );
    } catch (error) {
      return InternalServerErrorResponse(
        error instanceof Error ? error.message : String(error),
        commonMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
