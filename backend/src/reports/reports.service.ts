import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportReason } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(reporterId: string, dto: {
    productId?: string;
    reason: ReportReason;
    description: string;
  }) {
    return this.prisma.report.create({
      data: {
        reporterId,
        productId: dto.productId,
        reason: dto.reason,
        description: dto.description,
      },
    });
  }

  async getAll() {
    return this.prisma.report.findMany({
      include: {
        reporter: { select: { email: true, firstName: true, lastName: true } },
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolve(id: string) {
    return this.prisma.report.update({
      where: { id },
      data: { isResolved: true },
    });
  }
}
