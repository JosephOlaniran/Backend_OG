import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from '../vote/vote.entity';
import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';
import { Idea } from '../idea/idea.entity';
import { IdeaModule } from '../idea/idea.module';
import { VoteModule } from '../vote/vote.module';
import { CommentModule } from '../comment/comment.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote, Comment, User, Idea]),
    IdeaModule,
    VoteModule,
    CommentModule,
    UserModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
