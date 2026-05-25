import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, phone: true,
        firstName: true, lastName: true,
        avatar: true, role: true, isVerified: true,
        createdAt: true, seller: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: { firstName?: string; lastName?: string; phone?: string; avatar?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true },
    });
  }

  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: { where: { isPrimary: true }, take: 1 }, seller: { select: { businessName: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleFavorite(userId: string, productId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      await this.prisma.favorite.delete({ where: { userId_productId: { userId, productId } } });
      return { favorited: false };
    }
    await this.prisma.favorite.create({ data: { userId, productId } });
    return { favorited: true };
  }
}
