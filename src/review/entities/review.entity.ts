import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  pullRequestId!: number;

  @Column({ type: 'text' })
  summary!: string;

  @Column()
  overallScore!: number;

  @Column()
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
