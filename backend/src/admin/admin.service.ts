import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalSellers, totalProducts, totalOrders, pendingSellers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.seller.count({ where: { status: 'APPROVED' } }),
      this.prisma.product.count({ where: { status: 'ACTIVE' } }),
      this.prisma.order.count(),
      this.prisma.seller.count({ where: { status: 'PENDING' } }),
    ]);
    return { totalUsers, totalSellers, totalProducts, totalOrders, pendingSellers };
  }

  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip, take: limit,
        select: { id: true, email: true, firstName: true, lastName: true, role: true, isVerified: true, isActive: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getPendingSellers() {
    return this.prisma.seller.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async approveSeller(sellerId: string, adminId: string) {
    const seller = await this.prisma.seller.update({
      where: { id: sellerId },
      data: { status: 'APPROVED' },
    });
    await this.prisma.user.update({ where: { id: seller.userId }, data: { role: 'SELLER' } });
    await this.prisma.adminLog.create({
      data: { adminId, action: 'APPROVE_SELLER', target: sellerId },
    });
    return seller;
  }

  async rejectSeller(sellerId: string, adminId: string, reason?: string) {
    const seller = await this.prisma.seller.update({
      where: { id: sellerId },
      data: { status: 'REJECTED' },
    });
    await this.prisma.adminLog.create({
      data: { adminId, action: 'REJECT_SELLER', target: sellerId, details: reason },
    });
    return seller;
  }

  async banUser(userId: string, adminId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { isActive: false } });
    await this.prisma.adminLog.create({
      data: { adminId, action: 'BAN_USER', target: userId },
    });
    return { message: 'User banned' };
  }

  async getReports() {
    return this.prisma.report.findMany({
      where: { isResolved: false },
      include: {
        reporter: { select: { firstName: true, lastName: true, email: true } },
        product: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveReport(reportId: string, adminId: string) {
    await this.prisma.report.update({ where: { id: reportId }, data: { isResolved: true } });
    await this.prisma.adminLog.create({ data: { adminId, action: 'RESOLVE_REPORT', target: reportId } });
    return { message: 'Report resolved' };
  }
}
