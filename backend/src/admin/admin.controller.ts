import { Controller, Get, Put, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Admin dashboard stats' })
  stats() { return this.adminService.getDashboardStats(); }

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  users(@Query('page') page: number, @Query('limit') limit: number) {
    return this.adminService.getAllUsers(page, limit);
  }

  @Get('sellers/pending')
  @ApiOperation({ summary: 'Get pending seller applications' })
  pendingSellers() { return this.adminService.getPendingSellers(); }

  @Put('sellers/:id/approve')
  @ApiOperation({ summary: 'Approve a seller' })
  approveSeller(@Param('id') id: string, @Req() req: any) {
    return this.adminService.approveSeller(id, req.user.id);
  }

  @Put('sellers/:id/reject')
  @ApiOperation({ summary: 'Reject a seller' })
  rejectSeller(@Param('id') id: string, @Req() req: any, @Body() body: { reason?: string }) {
    return this.adminService.rejectSeller(id, req.user.id, body.reason);
  }

  @Put('users/:id/ban')
  @ApiOperation({ summary: 'Ban a user' })
  banUser(@Param('id') id: string, @Req() req: any) {
    return this.adminService.banUser(id, req.user.id);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get unresolved reports' })
  reports() { return this.adminService.getReports(); }

  @Put('reports/:id/resolve')
  @ApiOperation({ summary: 'Resolve a report' })
  resolveReport(@Param('id') id: string, @Req() req: any) {
    return this.adminService.resolveReport(id, req.user.id);
  }
}
