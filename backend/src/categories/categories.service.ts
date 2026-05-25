import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: { children: true, _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(slug: string) {
    const cat = await this.prisma.category.findUnique({
      where: { slug },
      include: { children: true, products: { where: { status: 'ACTIVE' }, take: 20, include: { images: { where: { isPrimary: true }, take: 1 } } } },
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  create(dto: { name: string; slug: string; description?: string; parentId?: string }) {
    return this.prisma.category.create({ data: dto });
  }
}
