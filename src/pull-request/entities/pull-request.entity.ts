import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pull_requests')
export class PullRequestEntity {
  @PrimaryGeneratedColumn({ name: 'pull_request_id' })
  id!: number;

  @Column({ name: 'github_pr_id', unique: true })
  githubPrId!: number;

  @Column({ name: 'repository_id' })
  repositoryId!: number;

  @Column({ name: 'pr_number' })
  prNumber!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column()
  author!: string;

  @Column({ name: 'source_branch' })
  sourceBranch!: string;

  @Column({ name: 'target_branch' })
  targetBranch!: string;

  @Column()
  state!: string;

  @Column({ default: false })
  merged!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
