import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ProductStatus, NotificationType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  private readonly rwfUsdRate: number;
  constructor(
    private prisma: PrismaService, 
    private config: ConfigService,
    private notifications: NotificationsService
  ) {
    this.rwfUsdRate = this.config.get<number>('RWF_USD_RATE', 1400);
  }

  async create(buyerId: string, items: { productId: string; quantity: number }[]) {
    // Validate products and calculate total
    let totalRwf = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || product.status !== ProductStatus.ACTIVE) {
        throw new BadRequestException(`Product ${item.productId} is not available`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.title}`);
      }
      totalRwf += product.priceRwf * item.quantity;
      orderItems.push({ productId: item.productId, quantity: item.quantity, priceRwf: product.priceRwf });
    }

    const order = await this.prisma.order.create({
      data: {
        buyerId,
        totalRwf,
        totalUsd: totalRwf / this.rwfUsdRate,
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });

    // Notify Sellers (handling multiple sellers if order has products from different sellers)
    const uniqueSellers = Array.from(new Set(order.items.map(i => i.product.sellerId)));
    for (const sellerId of uniqueSellers) {
      await this.notifications.create(
        sellerId,
        NotificationType.SYSTEM,
        'New Order Received! 🛍️',
        `You have a new order (#${order.id.slice(-6).toUpperCase()}) for ${order.items.length} items.`
      );
    }

    return order;
  }

  async getUserOrders(buyerId: string) {
    return this.prisma.order.findMany({
      where: { buyerId },
      include: {
        items: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOne(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: { include: { images: true, seller: true } } } },
        payment: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    // Allow buyer or seller to see it
    const isSeller = order.items.some(i => i.product.sellerId === userId);
    if (order.buyerId !== userId && !isSeller) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(orderId: string, status: any) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { buyer: true },
    });

    // Notify Buyer
    let title = '';
    let body = '';
    switch (status) {
      case 'CONFIRMED':
        title = 'Order Confirmed! ✅';
        body = `Your order #${order.id.slice(-6).toUpperCase()} has been confirmed by the seller.`;
        break;
      case 'SHIPPED':
        title = 'Order Shipped! 🚚';
        body = `Great news! Your order #${order.id.slice(-6).toUpperCase()} is on its way.`;
        break;
      case 'DELIVERED':
        title = 'Order Delivered! 🎁';
        body = `Your order #${order.id.slice(-6).toUpperCase()} has been delivered. enjoy your purchase!`;
        break;
      case 'CANCELLED':
        title = 'Order Cancelled ❌';
        body = `Your order #${order.id.slice(-6).toUpperCase()} has been cancelled.`;
        break;
    }

    if (title) {
      await this.notifications.create(order.buyerId, NotificationType.ORDER, title, body);
    }

    return order;
  }

  async getSellerOrders(sellerId: string) {
    return this.prisma.order.findMany({
      where: { items: { some: { product: { sellerId } } } },
      include: {
        items: { include: { product: true } },
        buyer: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
