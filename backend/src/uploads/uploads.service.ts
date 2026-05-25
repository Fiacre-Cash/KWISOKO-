import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadsService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File, folder = 'kwisoko/products'): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image', transformation: [{ width: 800, crop: 'limit', quality: 'auto' }] },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }

  async uploadProductImages(files: Express.Multer.File[], productId: string) {
    const uploads = await Promise.all(
      files.map((file) => this.uploadImage(file, `kwisoko/products/${productId}`)),
    );
    return uploads;
  }
}
