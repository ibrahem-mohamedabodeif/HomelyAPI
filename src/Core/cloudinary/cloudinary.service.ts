import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  UploadApiResponse,
  UploadApiErrorResponse,
  v2 as cloudinary,
} from 'cloudinary';
import * as streamifier from 'streamifier';
import { AppLogger } from '../filters/logger.service';

@Injectable()
export class CloudinaryService {
  constructor(private readonly logger: AppLogger) {}
  async uploadSingleImage(
    image: Express.Multer.File,
    folder: string,
  ): Promise<{ url: string; public_id: string }> {
    if (!image) {
      throw new BadRequestException('image is required.');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `homely/${folder}`,
          allowed_formats: ['jpg', 'jpeg', 'png'],
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            this.logger.error(
              `Cloudinary upload failed: ${error.message}`,
              error.stack,
            );
            reject(
              new InternalServerErrorException(
                `Failed to upload image: ${error.message}`,
              ),
            );
          } else {
            resolve({ url: result.secure_url, public_id: result.public_id });
          }
        },
      );
      streamifier.createReadStream(image.buffer).pipe(uploadStream);
    });
  }

  async uploadImages(
    images: Express.Multer.File[],
    folder: string,
  ): Promise<{ url: string; public_id: string }[]> {
    if (!images?.length) {
      throw new BadRequestException('No images provided.');
    }

    const uploadPromises = images.map((image) =>
      this.uploadSingleImage(image, folder),
    );
    return Promise.all(uploadPromises);
  }

  async deleteImages(publicIds: string[]): Promise<void> {
    if (!publicIds?.length) return;
    await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)));
  }
}
