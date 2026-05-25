import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initiate/:orderId')
  @ApiOperation({ summary: 'Initiate payment for an order (MoMo or Card)' })
  initiate(@Param('orderId') orderId: string, @Req() req: any, @Body() dto: any) {
    return this.paymentsService.initiatePayment(orderId, req.user.id, dto);
  }

  @Post('confirm/:paymentId')
  @ApiOperation({ summary: 'Confirm payment with transaction ID' })
  confirm(@Param('paymentId') paymentId: string, @Body() body: { transactionId: string }) {
    return this.paymentsService.confirmPayment(paymentId, body.transactionId);
  }

  @Get('status/:orderId')
  @ApiOperation({ summary: 'Get payment status for an order' })
  status(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentStatus(orderId);
  }
}
