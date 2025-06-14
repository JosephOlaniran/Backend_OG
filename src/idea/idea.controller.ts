import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IdeaStatus } from './idea.entity';
import { multerConfig } from '../config/multer.config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, UserRole } from '../user/user.entity';

@Controller('idea')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('attachments', 5, multerConfig))
  create(
    @Body() dto: CreateIdeaDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User,
  ) {
    return this.ideaService.create(dto, files, user);
  }

  @Get()
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('category') category?: string,
    @Query('sortBy') sortBy?: 'recent' | 'popular',
    @Query('search') search?: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    const filters = { employeeId, category, sortBy, search, offset, limit };
    return this.ideaService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const idea = await this.ideaService.findOne(id);
    if (!idea) {
      throw new NotFoundException(`Idea ${id} is not found`);
    }
    return idea;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateIdeaDto) {
    return this.ideaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.ideaService.remove(id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  approveIdea(@Param('id') id: number, @CurrentUser() user: User) {
    if (user.role === UserRole.ADMIN) {
      return this.ideaService.changeStatus(id, IdeaStatus.APPROVED, user);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Patch(':id/implemented')
  @UseGuards(JwtAuthGuard)
  implementedIdea(@Param('id') id: number, @CurrentUser() user: User) {
    if (user.role === UserRole.ADMIN) {
      return this.ideaService.changeStatus(id, IdeaStatus.IMPLMENTED, user);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  rejectIdea(@Param('id') id: number, @CurrentUser() user: User) {
    if (user.role === UserRole.ADMIN) {
      return this.ideaService.changeStatus(id, IdeaStatus.REJECTED, user);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
