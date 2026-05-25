import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('BUYER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getMyOrders(@Request() req) {
    return this.ordersService.getUserOrders(req.user.userId);
  }

  @Roles('SELLER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('seller')
  async getSellerOrders(@Request() req) {
    return this.ordersService.getSellerOrders(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.getOne(id, req.user.userId);
  }

  @Roles('SELLER', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}
