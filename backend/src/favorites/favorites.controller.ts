import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post(':productId')
  @ApiOperation({ summary: 'Toggle favorite for a product' })
  toggle(@Req() req: any, @Param('productId') productId: string) {
    return this.favoritesService.toggle(req.user.id, productId);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user favorites' })
  getAll(@Req() req: any) {
    return this.favoritesService.getMyFavorites(req.user.id);
  }
}
