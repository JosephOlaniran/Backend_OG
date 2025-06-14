import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { Idea } from 'src/idea/idea.entity';
import { User } from '../user/user.entity';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Idea, User]), ActivityModule],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
