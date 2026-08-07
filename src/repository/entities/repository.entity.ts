import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('repositories')
export class RepositoryEntity {
  @PrimaryGeneratedColumn({ name: 'repo_id' })
  id!: number;

  @Column({ name: 'githubrepo_id', unique: true })
  githubRepoId!: number;

  @Column({ name: 'owner' })
  owner!: string;

  @Column()
  name!: string;

  @Column({ name: 'default_batch' })
  defaultBranch!: string;

  @Column({ default: true, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
