import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get reviews for a product' })
  getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @Post('product/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave a review on a product' })
  create(
    @Req() req: any,
    @Param('productId') productId: string,
    @Body() dto: { rating: number; comment?: string },
  ) {
    return this.reviewsService.create(req.user.id, productId, dto);
  }
}
