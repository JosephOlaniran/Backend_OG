import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Idea } from '../idea/idea.entity';

export enum ActivityType {
  IDEA_SUBMITTED = 'idea_submitted',
  IDEA_VOTED = 'idea_voted',
  IDEA_COMMENTED = 'idea_commented',
  IDEA_APPROVED = 'idea_approved',
  IDEA_REJECTED = 'idea_rejected',
  IDEA_IMPLEMENTED = 'idea_implemented',
}

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Idea, (idea) => idea.id, { nullable: true })
  @JoinColumn({ name: 'ideaId' })
  idea: Idea;

  @Column({ nullable: true })
  ideaId: number;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;
}
