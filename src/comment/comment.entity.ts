// comment/comment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Idea } from 'src/idea/idea.entity';
import { User } from '../user/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @ManyToOne(() => Idea, (idea) => idea.comments)
  @JoinColumn({ name: 'ideaId' })
  idea: Idea;

  @Column()
  ideaId: number;

  @ManyToOne(() => User, (user) => user.id,{
  nullable: true,
  onDelete: 'SET NULL', // if user is deleted, keep the comment but nullify the userId
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
