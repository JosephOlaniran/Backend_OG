// idea/idea.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idea } from 'src/idea/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { IdeaResponseDto } from './dto/idea-response.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

import { Vote } from '../vote/vote.entity';
import { v4 as uuidv4 } from 'uuid';
import { IdeaStatus } from './idea.entity';
import { ActivityService } from '../activity/activity.service';

interface RawValues {
  commentCount: string;
  upVotes: string;
  downVotes: string;
}

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea) private readonly repo: Repository<Idea>,
    @InjectRepository(Vote) private readonly voteRepo: Repository<Vote>,
    private readonly userService: UserService,
    private readonly activityService: ActivityService,
  ) {}

  async findOne(id: number): Promise<IdeaResponseDto | null> {
    const query = this.repo
      .createQueryBuilder('idea')
      .leftJoinAndSelect('idea.user', 'user')
      .leftJoin('idea.comments', 'comment')
      .leftJoin('idea.votes', 'vote')
      .addSelect('COUNT(DISTINCT comment.id)', 'commentCount')
      .addSelect(
        'COUNT(DISTINCT CASE WHEN vote.isUpvote = true THEN vote.id END)',
        'upVotes',
      )
      .addSelect(
        'COUNT(DISTINCT CASE WHEN vote.isUpvote = false THEN vote.id END)',
        'downVotes',
      )
      .where('idea.id = :id', { id })
      .groupBy('idea.id')
      .addGroupBy('user.id');

    const result = await query.getRawAndEntities();

    if (!result.entities.length) return null;

    const idea = result.entities[0];
    const raw = result.raw[0] as RawValues;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = idea.user || {};

    return {
      id: idea.id,
      title: idea.title,
      description: idea.description,
      category: idea.category,
      impactLevel: idea.impactLevel,
      hashtags: idea.hashtags,
      attachmentUrls: idea.attachmentUrls,
      requiredResources: idea.requiredResources,
      anonymousId: idea.anonymousId,
      status: idea.status,
      createdAt: idea.createdAt,
      updatedAt: idea.updatedAt,
      commentCount: parseInt(raw.commentCount) || 0,
      upVotes: parseInt(raw.upVotes) || 0,
      downVotes: parseInt(raw.downVotes) || 0,
      user: user,
    };
  }

  async create(dto: CreateIdeaDto, files: Express.Multer.File[], user?: User) {
    const idea = this.repo.create(dto);
    idea.anonymousId = `anon-${uuidv4().slice(0, 8)}`;

    if (user) {
      idea.user = user;
    }

    if (files && files.length > 0) {
      idea.attachmentUrls = files.map((file) => file.filename);
    }

    const savedIdea = await this.repo.save(idea);

    // Log idea submission activity
    if (user) {
      await this.activityService.logIdeaSubmitted(user, savedIdea);
    }

    return savedIdea;
  }

  async findAll(filters: {
    employeeId?: string;
    category?: string;
    search?: string;
    sortBy?: 'recent' | 'popular';
    offset?: number;
    limit?: number;
  }): Promise<IdeaResponseDto[]> {
    const query = this.repo
      .createQueryBuilder('idea')
      .leftJoinAndSelect('idea.user', 'user')
      .leftJoin('idea.comments', 'comment')
      .leftJoin('idea.votes', 'vote')
      .addSelect('COUNT(DISTINCT comment.id)', 'commentCount')
      .addSelect(
        'COUNT(DISTINCT CASE WHEN vote.isUpvote = true THEN vote.id END)',
        'upVotes',
      )
      .addSelect(
        'COUNT(DISTINCT CASE WHEN vote.isUpvote = false THEN vote.id END)',
        'downVotes',
      )
      .groupBy('idea.id')
      .addGroupBy('user.id');

    // Apply filters
    if (filters.employeeId) {
      query.andWhere('user.employeeId = :employeeId', {
        employeeId: filters.employeeId,
      });
    }

    if (filters.category) {
      query.andWhere('idea.category = :category', {
        category: filters.category,
      });
    }

    if (filters.search) {
      query.andWhere(
        '(idea.title LIKE :search OR idea.description LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Apply sorting
    if (filters.sortBy === 'popular') {
      query.orderBy('upVotes', 'DESC').addOrderBy('idea.createdAt', 'DESC');
    } else {
      query.orderBy('idea.createdAt', 'DESC');
    }

    // Apply pagination
    if (filters.offset !== undefined) {
      query.skip(filters.offset);
    }
    if (filters.limit !== undefined) {
      query.take(filters.limit);
    }

    const results = await query.getRawAndEntities();

    // Transform each idea entity into the desired structure and return as array
    return results.entities.map((idea, index) => {
      const raw = results.raw[index] as RawValues;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = idea.user || {};

      return {
        id: idea.id,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        impactLevel: idea.impactLevel,
        hashtags: idea.hashtags,
        attachmentUrls: idea.attachmentUrls,
        requiredResources: idea.requiredResources,
        anonymousId: idea.anonymousId,
        status: idea.status,
        createdAt: idea.createdAt,
        updatedAt: idea.updatedAt,
        commentCount: parseInt(raw.commentCount) || 0,
        upVotes: parseInt(raw.upVotes) || 0,
        downVotes: parseInt(raw.downVotes) || 0,
        user: user,
      };
    });
  }

  async update(id: number, dto: UpdateIdeaDto) {
    const idea = await this.repo.findOne({ where: { id } });
    if (!idea) throw new NotFoundException('Idea not found');

    Object.assign(idea, dto);
    return this.repo.save(idea);
  }

  async remove(id: number) {
    const idea = await this.repo.findOne({ where: { id } });
    if (!idea) throw new NotFoundException('Idea not found');

    return this.repo.remove(idea);
  }

  async changeStatus(id: number, status: IdeaStatus, adminUser: User) {
    const idea = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!idea) throw new NotFoundException('Idea not found');

    idea.status = status;
    const savedIdea = await this.repo.save(idea);

    // Log status change activity
    switch (status) {
      case IdeaStatus.APPROVED:
        await this.activityService.logIdeaApproved(adminUser, savedIdea);
        break;
      case IdeaStatus.REJECTED:
        await this.activityService.logIdeaRejected(adminUser, savedIdea);
        break;
      case IdeaStatus.IMPLMENTED:
        await this.activityService.logIdeaImplemented(adminUser, savedIdea);
        break;
    }

    return savedIdea;
  }

  async findByUserId(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) return [];
    const result = await this.findAll({ employeeId: user.employeeId });

    return result;
  }
}
