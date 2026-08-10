import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryEntity } from './entities/repository.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RepositoryEntity])],
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class RepositoryModule {}
