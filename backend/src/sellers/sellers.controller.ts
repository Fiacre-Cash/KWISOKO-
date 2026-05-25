import { Controller, Post, Get, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Sellers')
@Controller('sellers')
export class SellersController {
  constructor(private sellersService: SellersService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply to become a seller' })
  apply(@Req() req: any, @Body() dto: any) {
    return this.sellersService.apply(req.user.id, dto);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get seller dashboard stats' })
  dashboard(@Req() req: any) {
    return this.sellersService.getDashboard(req.user.id);
  }

  @Get('my-products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products of the current seller' })
  getMyProducts(@Req() req: any) {
    return this.sellersService.getMyProducts(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public seller profile' })
  getProfile(@Param('id') id: string) {
    return this.sellersService.getProfile(id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update seller profile' })
  updateProfile(@Req() req: any, @Body() dto: any) {
    return this.sellersService.updateProfile(req.user.id, dto);
  }
}
