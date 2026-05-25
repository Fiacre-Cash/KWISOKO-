import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateChat(buyerId: string, sellerId: string) {
    let chat = await this.prisma.chat.findUnique({
      where: { sellerId_buyerId: { sellerId, buyerId } },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 50 } },
    });
    if (!chat) {
      chat = await this.prisma.chat.create({
        data: { sellerId, buyerId },
        include: { messages: true },
      });
    }
    return chat;
  }

  async getUserChats(userId: string) {
    return this.prisma.chat.findMany({
      where: { OR: [{ buyerId: userId }, { seller: { userId } }] },
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        seller: { select: { businessName: true, user: { select: { avatar: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendMessage(chatId: string, senderId: string, content: string) {
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) throw new NotFoundException('Chat not found');

    return this.prisma.message.create({
      data: { chatId, senderId, content },
      include: { sender: { select: { firstName: true, lastName: true, avatar: true } } },
    });
  }

  async getChatMessages(chatId: string, userId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { seller: { select: { userId: true } } },
    });
    if (!chat) throw new NotFoundException('Chat not found');
    if (chat.buyerId !== userId && chat.seller.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Mark messages as read
    await this.prisma.message.updateMany({
      where: { chatId, senderId: { not: userId }, isRead: false },
      data: { isRead: true },
    });

    return this.prisma.message.findMany({
      where: { chatId },
      include: { sender: { select: { firstName: true, lastName: true, avatar: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }
}
