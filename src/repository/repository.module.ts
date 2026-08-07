import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryEntity } from './entities/repository.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RepositoryEntity])],
  controllers: [RepositoryController],
  providers: [RepositoryService],
})
export class RepositoryModule {}
