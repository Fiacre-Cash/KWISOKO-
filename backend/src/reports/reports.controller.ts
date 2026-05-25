import { Controller, Post, Get, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, ReportReason } from '@prisma/client';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async create(@Request() req, @Body() dto: { productId?: string; reason: ReportReason; description: string }) {
    return this.reportsService.create(req.user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  async getAll() {
    return this.reportsService.getAll();
  }

  @Put(':id/resolve')
  @Roles(Role.ADMIN)
  async resolve(@Param('id') id: string) {
    return this.reportsService.resolve(id);
  }
}
