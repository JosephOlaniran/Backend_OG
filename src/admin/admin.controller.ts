import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('ideas')
  getAllIdeas(@Query('includeData') includeData?: string) {
    const shouldIncludeData = includeData !== 'false';
    return this.adminService.getAllIdeas(shouldIncludeData);
  }

  @Get('votes')
  getAllVotes(@Query('includeData') includeData?: string) {
    const shouldIncludeData = includeData !== 'false';
    return this.adminService.getAllVotes(shouldIncludeData);
  }

  @Get('comments')
  getAllComments(@Query('includeData') includeData?: string) {
    const shouldIncludeData = includeData !== 'false';
    return this.adminService.getAllComments(shouldIncludeData);
  }

  @Get('users')
  getAllUsers(@Query('includeData') includeData?: string) {
    const shouldIncludeData = includeData !== 'false';
    return this.adminService.getAllUsers(shouldIncludeData);
  }

  @Get('counts')
  getTotalCounts() {
    return this.adminService.getTotalCounts();
  }

  @Get('stats')
  getEntityStats() {
    return this.adminService.getEntityStats();
  }
}
