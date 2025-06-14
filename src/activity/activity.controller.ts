import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { ActivityType } from './activity.entity';

@Controller('admin/activity')
@UseGuards(JwtAuthGuard, AdminGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  getRecentActivities(@Query('limit') limit?: number) {
    const activityLimit = limit ? parseInt(limit.toString(), 10) : 50;
    return this.activityService.getRecentActivities(activityLimit);
  }

  @Get('user/:userId')
  getActivitiesByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    const activityLimit = limit ? parseInt(limit.toString(), 10) : 20;
    return this.activityService.getActivitiesByUser(userId, activityLimit);
  }

  @Get('idea/:ideaId')
  getActivitiesByIdea(
    @Param('ideaId') ideaId: number,
    @Query('limit') limit?: number,
  ) {
    const activityLimit = limit ? parseInt(limit.toString(), 10) : 20;
    return this.activityService.getActivitiesByIdea(ideaId, activityLimit);
  }

  @Get('type/:type')
  getActivitiesByType(
    @Param('type') type: ActivityType,
    @Query('limit') limit?: number,
  ) {
    const activityLimit = limit ? parseInt(limit.toString(), 10) : 20;
    return this.activityService.getActivitiesByType(type, activityLimit);
  }
}
