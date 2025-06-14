import { Controller, Post, Param, Body, Get, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/user.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':ideaId')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('ideaId') ideaId: number,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentService.create(ideaId, dto, user);
  }

  @Get(':ideaId')
  async findByIdea(@Param('ideaId') ideaId: string) {
    return this.commentService.findByIdea(ideaId);
  }
}
