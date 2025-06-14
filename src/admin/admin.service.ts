import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../vote/vote.entity';
import { Comment } from '../comment/comment.entity';
import { User, UserRole } from '../user/user.entity';
import { Idea, IdeaStatus } from '../idea/idea.entity';
import { IdeaService } from '../idea/idea.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Idea) private readonly ideaRepo: Repository<Idea>,
    @InjectRepository(Vote) private readonly voteRepo: Repository<Vote>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly ideaService: IdeaService,
  ) {}

  async getAllIdeas(includeData: boolean = true) {
    if (includeData) {
      const ideas = await this.ideaService.findAll({ sortBy: 'recent' });
      const count = ideas.length;
      return { data: ideas, count };
    } else {
      const count = await this.ideaRepo.count();
      return { count };
    }
  }

  async getAllVotes(includeData: boolean = true) {
    if (includeData) {
      const votes = await this.voteRepo.find({ relations: ['user', 'idea'] });
      const count = votes.length;
      return { data: votes, count };
    } else {
      const count = await this.voteRepo.count();
      return { count };
    }
  }

  async getAllComments(includeData: boolean = true) {
    if (includeData) {
      const comments = await this.commentRepo
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.idea', 'idea')
        .select([
          'comment.id',
          'comment.text',
          'comment.createdAt',
          'idea.id',
          'idea.title',
        ])
        .orderBy('comment.createdAt', 'DESC')
        .getMany();
      const count = comments.length;
      return { data: comments, count };
    } else {
      const count = await this.commentRepo.count();
      return { count };
    }
  }

  async getAllUsers(includeData: boolean = true) {
    if (includeData) {
      const users = await this.userRepo.find({
        order: { id: 'ASC' },
        select: ['id', 'name', 'employeeId', 'email', 'role', 'gender'],
      });
      const count = users.length;
      return { data: users, count };
    } else {
      const count = await this.userRepo.count();
      return { count };
    }
  }

  async getTotalCounts() {
    const [ideasCount, votesCount, commentsCount, usersCount] =
      await Promise.all([
        this.ideaRepo.count(),
        this.voteRepo.count(),
        this.commentRepo.count(),
        this.userRepo.count(),
      ]);

    return {
      ideas: ideasCount,
      votes: votesCount,
      comments: commentsCount,
      users: usersCount,
    };
  }

  async getEntityStats() {
    const [
      totalIdeas,
      approvedIdeas,
      pendingIdeas,
      rejectedIdeas,
      implementedIdeas,
      totalVotes,
      upvotes,
      downvotes,
      totalComments,
      totalUsers,
      adminUsers,
    ] = await Promise.all([
      this.ideaRepo.count(),
      this.ideaRepo.count({ where: { status: IdeaStatus.APPROVED } }),
      this.ideaRepo.count({ where: { status: IdeaStatus.PENDING } }),
      this.ideaRepo.count({ where: { status: IdeaStatus.REJECTED } }),
      this.ideaRepo.count({ where: { status: IdeaStatus.IMPLMENTED } }),
      this.voteRepo.count(),
      this.voteRepo.count({ where: { isUpvote: true } }),
      this.voteRepo.count({ where: { isUpvote: false } }),
      this.commentRepo.count(),
      this.userRepo.count(),
      this.userRepo.count({ where: { role: UserRole.ADMIN } }),
    ]);

    return {
      ideas: {
        total: totalIdeas,
        approved: approvedIdeas,
        pending: pendingIdeas,
        rejected: rejectedIdeas,
        implemented: implementedIdeas,
      },
      votes: {
        total: totalVotes,
        upvotes,
        downvotes,
      },
      comments: {
        total: totalComments,
      },
      users: {
        total: totalUsers,
        admins: adminUsers,
        employees: totalUsers - adminUsers,
      },
    };
  }
}
