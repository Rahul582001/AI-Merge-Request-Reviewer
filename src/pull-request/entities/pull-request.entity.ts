import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pull_requests')
export class PullRequestEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  githubPrId!: number;

  @Column()
  repositoryId!: number;

  @Column()
  prNumber!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column()
  author!: string;

  @Column()
  sourceBranch!: string;

  @Column()
  targetBranch!: string;

  @Column()
  state!: string;

  @Column({ default: false })
  merged!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
