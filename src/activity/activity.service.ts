import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity, ActivityType } from './activity.entity';
import { User } from '../user/user.entity';
import { Idea } from '../idea/idea.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity) private readonly repo: Repository<Activity>,
  ) {}

  async logActivity(
    type: ActivityType,
    user: User,
    idea?: Idea,
    metadata?: any,
  ): Promise<Activity> {
    const activity = this.repo.create({
      type,
      user,
      userId: user.id,
      idea,
      ideaId: idea?.id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      metadata,
    });

    return this.repo.save(activity);
  }

  async logIdeaSubmitted(user: User, idea: Idea): Promise<Activity> {
    return this.logActivity(ActivityType.IDEA_SUBMITTED, user, idea, {
      ideaTitle: idea.title,
    });
  }

  async logIdeaVoted(
    user: User,
    idea: Idea,
    isUpvote: boolean,
  ): Promise<Activity> {
    return this.logActivity(ActivityType.IDEA_VOTED, user, idea, {
      ideaTitle: idea.title,
      voteType: isUpvote ? 'upvote' : 'downvote',
      userName: user.name,
      userEmail: user.email,
    });
  }

  async logIdeaCommented(user: User, idea: Idea): Promise<Activity> {
    return this.logActivity(ActivityType.IDEA_COMMENTED, user, idea, {
      ideaTitle: idea.title,
      userName: user.name,
      userEmail: user.email,
    });
  }

  async logIdeaApproved(user: User, idea: Idea): Promise<Activity> {
    return this.logActivity(ActivityType.IDEA_APPROVED, user, idea, {
      ideaTitle: idea.title,
      userName: user.name,
      userEmail: user.email,
    });
  }

  async logIdeaRejected(user: User, idea: Idea): Promise<Activity> {
    return this.logActivity(ActivityType.IDEA_REJECTED, user, idea, {
      ideaTitle: idea.title,
      userName: user.name,
      userEmail: user.email,
    });
  }

  async logIdeaImplemented(user: User, idea: Idea): Promise<Activity> {
    return this.logActivity(ActivityType.IDEA_IMPLEMENTED, user, idea, {
      ideaTitle: idea.title,
      userName: user.name,
      userEmail: user.email,
    });
  }

  async getRecentActivities(limit: number = 50): Promise<Activity[]> {
    return this.repo.find({
      relations: ['user', 'idea'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getActivitiesByUser(
    userId: string,
    limit: number = 20,
  ): Promise<Activity[]> {
    return this.repo.find({
      where: { userId },
      relations: ['user', 'idea'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getActivitiesByIdea(
    ideaId: number,
    limit: number = 20,
  ): Promise<Activity[]> {
    return this.repo.find({
      where: { ideaId },
      relations: ['user', 'idea'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getActivitiesByType(
    type: ActivityType,
    limit: number = 20,
  ): Promise<Activity[]> {
    return this.repo.find({
      where: { type },
      relations: ['user', 'idea'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
