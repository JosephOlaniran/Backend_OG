// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from './user/user.entity';
import { Idea } from './idea/idea.entity';
import { Comment } from './comment/comment.entity';
import { Vote } from './vote/vote.entity';
import { Activity } from './activity/activity.entity';
import { UserModule } from './user/user.module';
import { IdeaModule } from './idea/idea.module';
import { CommentModule } from './comment/comment.module';
import { VoteModule } from './vote/vote.module';
import { CategoriesModule } from './categories/categories.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminModule } from './admin/admin.module';
import { ActivityModule } from './activity/activity.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'turntable.proxy.rlwy.net',
      port: 48545,
      username: 'root',
      password: 'zYbSqlTMZwudzCCzbFiLthvLNNkyDWzC',
      database: 'railway',
      entities: [User, Idea, Comment, Vote, Activity],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    IdeaModule,
    CommentModule,
    VoteModule,
    CategoriesModule,
    DashboardModule,
    AdminModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
