// comment/comment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Idea } from 'src/idea/idea.entity';
import { ActivityService } from '../activity/activity.service';
import { User } from '../user/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly repo: Repository<Comment>,
    @InjectRepository(Idea) private readonly ideaRepo: Repository<Idea>,
    private readonly activityService: ActivityService,
  ) {}

  async create(ideaId: number, dto: CreateCommentDto, user: User) {
    const idea = await this.ideaRepo.findOne({ where: { id: ideaId } });
    if (!idea) throw new NotFoundException('Idea not found');

    const comment = this.repo.create({
      text: dto.text,
      idea,
      ideaId,
      user,
      userId: user.id,
    });
    const savedComment = await this.repo.save(comment);

    // Log comment activity
    await this.activityService.logIdeaCommented(user, idea);

    return savedComment;
  }

  async findByIdea(ideaId: string): Promise<any[]> {
    const numericIdeaId = Number(ideaId);

    // Verify parent exists
    const idea = await this.ideaRepo.findOne({
      where: { id: numericIdeaId },
    });

    if (!idea) {
      throw new NotFoundException('Idea not found');
    }

    const data = await this.repo.find({
      where: { ideaId: numericIdeaId },
      relations: ['idea'],
      order: { createdAt: 'DESC' },
    });

    const filteredData = data.map((x) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { idea: _, ...rest } = x;
      return rest;
    });

    return filteredData;
  }

  async getCommentCount(ideaId: number): Promise<number> {
    return this.repo.count({
      where: { ideaId },
    });
  }

  async getCommentCounts(
    ideaIds: number[],
  ): Promise<{ [key: number]: number }> {
    if (ideaIds.length === 0) return {};

    const counts: { ideaId: number; count: string }[] = await this.repo
      .createQueryBuilder('comment')
      .select('comment.ideaId', 'ideaId')
      .addSelect('COUNT(comment.id)', 'count')
      .where('comment.ideaId IN (:...ideaIds)', { ideaIds })
      .groupBy('comment.ideaId')
      .getRawMany();

    const result: { [key: number]: number } = {};
    ideaIds.forEach((id) => {
      result[id] = 0;
    });

    counts.forEach(({ ideaId, count }) => {
      result[ideaId] = parseInt(count);
    });

    return result;
  }
}
