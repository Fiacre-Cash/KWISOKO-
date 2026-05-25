import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SellerStatus } from '@prisma/client';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async apply(userId: string, dto: { businessName: string; description?: string; location?: string; idDocumentUrl?: string }) {
    const existing = await this.prisma.seller.findUnique({ where: { userId } });
    if (existing) throw new ConflictException('Seller application already exists');

    return this.prisma.seller.create({
      data: { userId, ...dto },
    });
  }

  async getProfile(sellerId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true, avatar: true } },
        products: {
          where: { status: 'ACTIVE' },
          include: { images: { where: { isPrimary: true }, take: 1 } },
          take: 10,
        },
      },
    });
    if (!seller) throw new NotFoundException('Seller not found');
    return seller;
  }

  async getDashboard(userId: string) {
    const seller = await this.prisma.seller.findUnique({ where: { userId } });
    if (!seller) throw new NotFoundException('Seller profile not found');

    const [totalProducts, totalOrders, recentProducts] = await Promise.all([
      this.prisma.product.count({ where: { sellerId: seller.id } }),
      this.prisma.orderItem.count({ where: { product: { sellerId: seller.id } } }),
      this.prisma.product.findMany({
        where: { sellerId: seller.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { images: { where: { isPrimary: true }, take: 1 } },
      }),
    ]);

    return { seller, totalProducts, totalOrders, recentProducts };
  }

  async updateProfile(userId: string, dto: any) {
    const seller = await this.prisma.seller.findUnique({ where: { userId } });
    if (!seller) throw new NotFoundException('Seller not found');
    return this.prisma.seller.update({ where: { userId }, data: dto });
  }

  async getMyProducts(userId: string) {
    const seller = await this.prisma.seller.findUnique({ where: { userId } });
    if (!seller) throw new NotFoundException('Seller profile not found');

    return this.prisma.product.findMany({
      where: { sellerId: seller.id },
      include: { images: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
