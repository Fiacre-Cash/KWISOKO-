import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Roles(Role.SELLER)
  async subscribe(@Request() req, @Body() dto: { plan: string }) {
    // Note: In a real app, this would be called after a successful payment
    return this.subscriptionsService.create(req.user.seller.id, dto.plan);
  }

  @Get('my')
  @Roles(Role.SELLER)
  async getMySubscriptions(@Request() req) {
    return this.subscriptionsService.getSellerSubscriptions(req.user.seller.id);
  }

  @Get('active')
  @Roles(Role.SELLER)
  async getActive(@Request() req) {
    return this.subscriptionsService.getCurrentActive(req.user.seller.id);
  }
}
