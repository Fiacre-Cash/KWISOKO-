import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Subscription } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(sellerId: string, plan: string) {
    const seller = await this.prisma.seller.findUnique({ where: { id: sellerId } });
    if (!seller) throw new NotFoundException('Seller not found');

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Default to 1 month

    const subscription = await this.prisma.subscription.create({
      data: {
        sellerId,
        plan,
        startDate,
        endDate,
        isActive: true,
      },
    });

    await this.prisma.seller.update({
      where: { id: sellerId },
      data: { isSubscribed: true },
    });

    return subscription;
  }

  async getSellerSubscriptions(sellerId: string) {
    return this.prisma.subscription.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCurrentActive(sellerId: string) {
    return this.prisma.subscription.findFirst({
      where: { sellerId, isActive: true, endDate: { gt: new Date() } },
    });
  }

  async cancel(id: string) {
    return this.prisma.subscription.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
