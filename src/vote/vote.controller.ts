import { Controller, Post, Param, Body, UseGuards, Get } from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/user.entity';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post(':ideaId')
  @UseGuards(JwtAuthGuard)
  vote(
    @Param('ideaId') ideaId: number,
    @Body() dto: CreateVoteDto,
    @CurrentUser() user: User,
  ) {
    return this.voteService.vote(ideaId, dto, user);
  }

  @Get(':ideaId')
  getVotesByIdea(@Param('ideaId') ideaId: number) {
    return this.voteService.getVotesByIdea(ideaId);
  }

  @Get(':ideaId/count')
  getVoteCount(@Param('ideaId') ideaId: number) {
    return this.voteService.getVoteCount(ideaId);
  }

  @Get(':ideaId/user')
  @UseGuards(JwtAuthGuard)
  getUserVoteForIdea(
    @Param('ideaId') ideaId: number,
    @CurrentUser() user: User,
  ) {
    return this.voteService.getUserVoteForIdea(user.id, ideaId);
  }
}
