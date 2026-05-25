import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chats')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all chats for current user' })
  getUserChats(@Req() req: any) {
    return this.chatsService.getUserChats(req.user.id);
  }

  @Post('start/:sellerId')
  @ApiOperation({ summary: 'Start or get chat with a seller' })
  startChat(@Req() req: any, @Param('sellerId') sellerId: string) {
    return this.chatsService.getOrCreateChat(req.user.id, sellerId);
  }

  @Get(':chatId/messages')
  @ApiOperation({ summary: 'Get messages in a chat' })
  getMessages(@Param('chatId') chatId: string, @Req() req: any) {
    return this.chatsService.getChatMessages(chatId, req.user.id);
  }

  @Post(':chatId/messages')
  @ApiOperation({ summary: 'Send a message' })
  sendMessage(
    @Param('chatId') chatId: string,
    @Req() req: any,
    @Body() body: { content: string },
  ) {
    return this.chatsService.sendMessage(chatId, req.user.id, body.content);
  }
}
