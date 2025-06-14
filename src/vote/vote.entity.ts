// vote/vote.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Idea } from 'src/idea/idea.entity';
import { User } from '../user/user.entity';

@Entity()
@Unique(['userId', 'ideaId'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isUpvote: boolean;

  @ManyToOne(() => Idea, (idea) => idea.id)
  @JoinColumn({ name: 'ideaId' })
  idea: Idea;

  @Column()
  ideaId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;
}
