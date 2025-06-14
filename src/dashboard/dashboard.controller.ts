import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/user.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('progress')
  @UseGuards(JwtAuthGuard)
  getProgress(@CurrentUser() user: User) {
    return this.dashboardService.getProgress(user.id);
  }

  @Get('metrics')
  @UseGuards(JwtAuthGuard)
  getMetrics(@CurrentUser() user: User) {
    return this.dashboardService.getMetrics(user.id);
  }
}
