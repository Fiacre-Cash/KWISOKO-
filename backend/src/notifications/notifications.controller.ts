import { Controller, Get, Put, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  getAll(@Req() req: any) { return this.notificationsService.getUserNotifications(req.user.userId); }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  unreadCount(@Req() req: any) { return this.notificationsService.getUnreadCount(req.user.userId); }

  @Put('mark-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markRead(@Req() req: any) { return this.notificationsService.markAllRead(req.user.userId); }
}
