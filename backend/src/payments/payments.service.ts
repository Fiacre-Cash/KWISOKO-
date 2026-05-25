import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async initiatePayment(orderId: string, userId: string, dto: {
    method: PaymentMethod;
    momoPhone?: string;
  }) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== userId) throw new BadRequestException('Not your order');
    if (order.payment) throw new BadRequestException('Payment already initiated');

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        method: dto.method,
        amountRwf: order.totalRwf,
        amountUsd: order.totalUsd,
        momoPhone: dto.momoPhone,
        status: PaymentStatus.PENDING,
      },
    });

    // Simulate real MoMo API (MTN Rwanda / Airtel Money)
    // In a real app, this would call the external API and then wait for a webhook
    if (dto.method === PaymentMethod.MOMO) {
      console.log(`📱 MoMo payment initiated to ${dto.momoPhone} for ${order.totalRwf} RWF`);
      
      // Simulate async confirmation after 5 seconds
      setTimeout(async () => {
        try {
          await this.confirmPayment(payment.id, `TRANS-${Math.random().toString(36).substring(7).toUpperCase()}`);
          console.log(`✅ MoMo payment ${payment.id} confirmed automatically (Simulated)`);
        } catch (err) {
          console.error(`❌ Failed to confirm simulated MoMo payment: ${err.message}`);
        }
      }, 5000);
    }

    return { payment, message: 'Payment initiated. Awaiting MoMo confirmation (SIMULATED).' };
  }

  async confirmPayment(paymentId: string, transactionId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.SUCCESS, transactionId },
    });

    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { status: OrderStatus.CONFIRMED },
    });

    return updated;
  }

  async getPaymentStatus(orderId: string) {
    return this.prisma.payment.findUnique({ where: { orderId } });
  }
}
