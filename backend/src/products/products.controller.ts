import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all active products with filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product details' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (Seller only)' })
  create(@Req() req: any, @Body() dto: any) {
    return this.productsService.create(req.user.seller?.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (Seller only)' })
  update(@Param('id') id: string, @Req() req: any, @Body() dto: any) {
    return this.productsService.update(id, req.user.seller?.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a product (Seller only)' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.productsService.remove(id, req.user.seller?.id);
  }
}
