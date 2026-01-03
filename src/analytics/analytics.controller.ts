import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '../roles/entities/role.entity';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN, RoleType.APARTMENT_MANAGER)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('requests-by-category')
  getRequestsByCategory() {
    return this.analyticsService.getRequestsByCategory();
  }

  @Get('average-resolution-time')
  getAverageResolutionTime() {
    return this.analyticsService.getAverageResolutionTime();
  }

  @Get('most-problematic-apartments')
  getMostProblematicApartments(@Query('limit') limit?: string) {
    return this.analyticsService.getMostProblematicApartments(
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('status-distribution')
  getStatusDistribution() {
    return this.analyticsService.getStatusDistribution();
  }

  @Get('category-resolution-stats')
  getCategoryResolutionStats() {
    return this.analyticsService.getCategoryResolutionStats();
  }
}


