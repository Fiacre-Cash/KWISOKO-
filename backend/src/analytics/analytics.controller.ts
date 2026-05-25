import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admin')
  @Roles(Role.ADMIN)
  async getAdminStats() {
    return this.analyticsService.getAdminStats();
  }

  @Get('seller')
  @Roles(Role.SELLER)
  async getSellerStats(@Request() req) {
    return this.analyticsService.getSellerStats(req.user.seller.id);
  }
}
