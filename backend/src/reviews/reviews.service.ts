import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, productId: string, dto: { rating: number; comment?: string }) {
    const existing = await this.prisma.review.findUnique({
      where: { productId_userId: { productId, userId } },
    });
    if (existing) throw new ConflictException('You already reviewed this product');

    const review = await this.prisma.review.create({
      data: { userId, productId, ...dto },
      include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
    });

    // Update seller rating
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (product) {
      const avg = await this.prisma.review.aggregate({
        where: { product: { sellerId: product.sellerId } },
        _avg: { rating: true },
      });
      await this.prisma.seller.update({
        where: { id: product.sellerId },
        data: { rating: avg._avg.rating || 0 },
      });
    }

    return review;
  }

  getProductReviews(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
