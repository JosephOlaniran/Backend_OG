import { Module, forwardRef } from '@nestjs/common';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './idea.entity';
import { Vote } from '../vote/vote.entity';
import { UserModule } from '../user/user.module';
import { CommentModule } from '../comment/comment.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Idea, Vote]),
    UserModule,
    forwardRef(() => CommentModule),
    ActivityModule,
  ],
  controllers: [IdeaController],
  providers: [IdeaService],
  exports: [IdeaService],
})
export class IdeaModule {}
