import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { IdeaModule } from '../idea/idea.module';
import { Vote } from '../vote/vote.entity';
import { Comment } from '../comment/comment.entity';

@Module({
  imports: [IdeaModule, TypeOrmModule.forFeature([Vote, Comment])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
