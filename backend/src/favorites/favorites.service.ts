import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({
        where: { userId_productId: { userId, productId } },
      });
      return { favorited: false };
    } else {
      await this.prisma.favorite.create({
        data: { userId, productId },
      });
      return { favorited: true };
    }
  }

  async getMyFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            seller: { select: { businessName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
