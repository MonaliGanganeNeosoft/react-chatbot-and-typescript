import { SuccessResponse } from '@401_digital/xrm-core';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/core/auth.guard';
import { CurrentUser } from 'src/decorators';
import { UsersEntity } from '../users/users.entity';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@UseGuards(AuthGuard())
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboard: DashboardService) {}
  @Get()
  async loadDashboard(@CurrentUser() user: UsersEntity) {
    return new SuccessResponse(await this.dashboard.loadDashboard(user.id));
  }
}
