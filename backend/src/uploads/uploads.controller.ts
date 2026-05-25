import {
  Controller, Post, Param, UseGuards, UseInterceptors,
  UploadedFiles, UploadedFile,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { memoryStorage } from 'multer';

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadsController {
  constructor(
    private uploadsService: UploadsService,
    private prisma: PrismaService,
  ) {}

  @Post('products/:productId/images')
  @ApiOperation({ summary: 'Upload product images (max 5)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 5, { storage: memoryStorage() }))
  async uploadProductImages(
    @Param('productId') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploaded = await this.uploadsService.uploadProductImages(files, productId);

    const images = await Promise.all(
      uploaded.map((img, i) =>
        this.prisma.productImage.create({
          data: { productId, url: img.url, publicId: img.publicId, isPrimary: i === 0 },
        }),
      ),
    );
    return images;
  }

  @Post('avatar')
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar', { storage: memoryStorage() }))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadImage(file, 'kwisoko/avatars');
  }
}
