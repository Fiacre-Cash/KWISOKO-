import { Controller, Get, Put, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@Req() req: any, @Body() dto: any) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Get('me/favorites')
  @ApiOperation({ summary: 'Get user favorites' })
  getFavorites(@Req() req: any) {
    return this.usersService.getFavorites(req.user.id);
  }

  @Post('me/favorites/:productId')
  @ApiOperation({ summary: 'Toggle product favorite' })
  toggleFavorite(@Req() req: any, @Param('productId') productId: string) {
    return this.usersService.toggleFavorite(req.user.id, productId);
  }
}
