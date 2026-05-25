import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    search?: string;
    categoryId?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const { search, categoryId, location, minPrice, maxPrice, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { status: ProductStatus.ACTIVE };
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (categoryId) where.categoryId = categoryId;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (minPrice || maxPrice) {
      where.priceRwf = {};
      if (minPrice) where.priceRwf.gte = minPrice;
      if (maxPrice) where.priceRwf.lte = maxPrice;
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { name: true, slug: true } },
          seller: { select: { businessName: true, location: true, rating: true } },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        seller: {
          include: { user: { select: { firstName: true, lastName: true, phone: true } } },
        },
        reviews: {
          include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        favorites: true,
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Increment view count
    await this.prisma.product.update({ where: { id }, data: { viewCount: { increment: 1 } } });

    return product;
  }

  async create(sellerId: string, dto: any) {
    return this.prisma.product.create({
      data: { ...dto, sellerId },
      include: { images: true, category: true },
    });
  }

  async update(id: string, sellerId: string, dto: any) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.sellerId !== sellerId) throw new ForbiddenException();

    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string, sellerId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.sellerId !== sellerId) throw new ForbiddenException();

    await this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.REMOVED },
    });
    return { message: 'Product removed' };
  }

  async getSellerProducts(sellerId: string) {
    return this.prisma.product.findMany({
      where: { sellerId },
      include: { images: { where: { isPrimary: true }, take: 1 }, category: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
