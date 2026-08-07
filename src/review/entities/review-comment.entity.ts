import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('review_comments')
export class ReviewCommentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  reviewId!: number;

  @Column()
  fileName!: string;

  @Column()
  lineNumber!: number;

  @Column()
  severity!: string;

  @Column({ type: 'text' })
  comment!: string;

  @Column({ type: 'text', nullable: true })
  suggestedCode!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
