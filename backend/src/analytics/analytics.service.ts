import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAdminStats() {
    const [totalUsers, totalSellers, totalProducts, totalOrders, revenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.seller.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { totalRwf: true },
        where: { status: 'CONFIRMED' },
      }),
    ]);

    return {
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenueRwf: revenue._sum.totalRwf || 0,
    };
  }

  async getSellerStats(sellerId: string) {
    const [totalProducts, totalSales, revenue, recentOrders] = await Promise.all([
      this.prisma.product.count({ where: { sellerId } }),
      this.prisma.orderItem.count({
        where: { product: { sellerId }, order: { status: 'CONFIRMED' } },
      }),
      this.prisma.orderItem.aggregate({
        _sum: { priceRwf: true },
        where: { product: { sellerId }, order: { status: 'CONFIRMED' } },
      }),
      this.prisma.order.findMany({
        where: { items: { some: { product: { sellerId } } } },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { buyer: true },
      }),
    ]);

    return {
      totalProducts,
      totalSales,
      totalRevenueRwf: revenue._sum.priceRwf || 0,
      recentOrders,
    };
  }
}
