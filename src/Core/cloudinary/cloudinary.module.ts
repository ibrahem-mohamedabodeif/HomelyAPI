import { Module } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';
import { LoggerModule } from '../filters/logger.module';

@Module({
  providers: [
    {
      provide: 'Cloudinary',
      useFactory: () => {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        return cloudinary;
      },
    },
    CloudinaryService,
  ],
  exports: [CloudinaryService],
  imports: [LoggerModule],
})
export class CloudinaryModule {}
