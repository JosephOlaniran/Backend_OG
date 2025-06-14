import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity } from './activity.entity';
import { User } from '../user/user.entity';
import { Idea } from '../idea/idea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, User, Idea])],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
