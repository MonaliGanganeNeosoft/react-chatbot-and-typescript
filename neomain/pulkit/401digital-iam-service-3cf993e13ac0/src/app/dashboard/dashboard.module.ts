import { Module } from '@nestjs/common';
import { RolesService } from '../user-roles/roles.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, RolesService],
})
export class DashboardModule {}
