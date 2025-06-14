// vote/vote.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { Idea } from 'src/idea/idea.entity';
import { User } from '../user/user.entity';
import { CreateVoteDto } from './dto/create-vote.dto';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote) private readonly repo: Repository<Vote>,
    @InjectRepository(Idea) private readonly ideaRepo: Repository<Idea>,
    private readonly activityService: ActivityService,
  ) {}

  async vote(ideaId: number, dto: CreateVoteDto, user: User) {
    const idea = await this.ideaRepo.findOne({ where: { id: ideaId } });
    if (!idea) throw new NotFoundException('Idea not found');

    // Check if user already has a vote for this idea
    const existingVote = await this.repo.findOne({
      where: { userId: user.id, ideaId },
    });

    if (existingVote) {
      // If same vote type, remove the vote (toggle off)
      if (existingVote.isUpvote === dto.isUpvote) {
        await this.repo.remove(existingVote);
        return { message: 'Vote removed' };
      } else {
        // If different vote type, update the vote
        existingVote.isUpvote = dto.isUpvote;
        await this.repo.save(existingVote);
        // Log the voting activity
        await this.activityService.logIdeaVoted(user, idea, dto.isUpvote);
        return { message: 'Vote updated', vote: existingVote };
      }
    } else {
      // Create new vote
      const vote = this.repo.create({
        isUpvote: dto.isUpvote,
        idea,
        ideaId,
        user,
        userId: user.id,
      });
      const savedVote = await this.repo.save(vote);

      // Log the voting activity
      await this.activityService.logIdeaVoted(user, idea, dto.isUpvote);

      return { message: 'Vote created', vote: savedVote };
    }
  }

  async getVotesByIdea(ideaId: number) {
    return this.repo.find({
      where: { ideaId },
      relations: ['user'],
    });
  }

  async getUserVoteForIdea(userId: string, ideaId: number) {
    return this.repo.findOne({
      where: { userId, ideaId },
    });
  }

  async getVoteCount(ideaId: number) {
    const upvotes = await this.repo.count({
      where: { ideaId, isUpvote: true },
    });
    const downvotes = await this.repo.count({
      where: { ideaId, isUpvote: false },
    });
    return { upvotes, downvotes, total: upvotes + downvotes };
  }
}
