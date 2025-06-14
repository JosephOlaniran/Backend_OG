import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../vote/vote.entity';
import { Comment } from '../comment/comment.entity';
import { IdeaService } from '../idea/idea.service';
import { IdeaStatus } from '../idea/idea.entity';

@Injectable()
export class DashboardService {
  constructor(
    private readonly ideaService: IdeaService,
    @InjectRepository(Vote) private readonly voteRepo: Repository<Vote>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async getProgress(userId: string) {
    // Get total number of ideas submitted by the current user using IdeaService
    const userIdeas = await this.ideaService.findByUserId(userId);
    const submitted = userIdeas.length;

    return {
      submitted,
      goal: 10, // Keep as static goal
    };
  }

  async getMetrics(userId: string) {
    // Get user's ideas using IdeaService
    const userIdeas = await this.ideaService.findByUserId(userId);
    const userIdeaIds = userIdeas.map((idea) => idea.id);

    // Calculate topIdeasPercentage using IdeaService
    let topIdeasPercentage = 0;
    if (userIdeaIds.length > 0) {
      // Get top 10 most popular ideas globally using IdeaService
      const topIdeas = await this.ideaService.findAll({
        sortBy: 'popular',
        limit: 10,
      });

      const userIdeasInTop10 = topIdeas.filter((idea) =>
        userIdeaIds.includes(idea.id),
      ).length;

      topIdeasPercentage =
        userIdeas.length > 0
          ? (userIdeasInTop10 / Math.min(userIdeas.length, 10)) * 100
          : 0;
    }

    // Calculate communityPoints (total upvotes on user's ideas)
    const communityPoints = await this.voteRepo
      .createQueryBuilder('vote')
      .where('vote.isUpvote = :isUpvote', { isUpvote: true })
      .andWhere('vote.ideaId IN (:...ideaIds)', {
        ideaIds: userIdeaIds.length > 0 ? userIdeaIds : [0],
      })
      .getCount();

    // Calculate engagementRate (percentage of user's ideas that have received comments or votes)
    let engagementRate = 0;
    if (userIdeas.length > 0) {
      let engagedIdeasCount = 0;
      for (const ideaId of userIdeaIds) {
        const voteCount = await this.voteRepo.count({
          where: { idea: { id: ideaId } },
        });
        const commentCount = await this.commentRepo.count({
          where: { ideaId },
        });
        if (voteCount > 0 || commentCount > 0) {
          engagedIdeasCount++;
        }
      }
      engagementRate = (engagedIdeasCount / userIdeas.length) * 100;
    }

    // Calculate ideasImplemented (approved ideas by the user)
    const approvedUserIdeas = userIdeas.filter(
      (idea) => idea.status === IdeaStatus.IMPLMENTED,
    );
    const ideasImplemented = approvedUserIdeas.length;

    return {
      topIdeasPercentage: Math.round(topIdeasPercentage * 10) / 10,
      engagementRate: Math.round(engagementRate * 10) / 10,
      communityPoints,
      ideasImplemented,
    };
  }
}
