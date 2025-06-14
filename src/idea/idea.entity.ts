// idea/idea.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from 'src/comment/comment.entity';
import { Vote } from 'src/vote/vote.entity';

export enum IdeaStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  IMPLMENTED = 'implmented',
  REJECTED = 'rejected',
}

@Entity()
export class Idea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column()
  impactLevel: string;

  @Column('simple-array', { nullable: true })
  hashtags: string[];

  @Column({ type: 'json', nullable: true })
  attachmentUrls: string[];

  @Column({ nullable: true })
  requiredResources: string;

  @Column()
  anonymousId: string;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.idea, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Vote, (vote) => vote.idea, { cascade: true })
  votes: Vote[];

  @Column({ type: 'enum', enum: IdeaStatus, default: IdeaStatus.PENDING })
  status: IdeaStatus;
}
