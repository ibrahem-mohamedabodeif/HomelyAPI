import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as PlaceRepository from '../reposetory/place.interface';
import { CreatePlaceDto } from '../dto/createPlace.dto';
import { UpdatePlaceDto } from '../dto/updatePlace.dto';
import { CloudinaryService } from 'src/Core/cloudinary/cloudinary.service';
import { plainToInstance } from 'class-transformer';
import { PlaceEntity } from '../entity/place.entity';
import { AppLogger } from 'src/Core/filters/logger.service';
import { Photo } from 'src/Core/types/photo.type';
import { DefaultResponseDto } from 'src/Core/types/defaultResponse.dto';

@Injectable()
export class PlaceService {
  constructor(
    @Inject(PlaceRepository.IPlaceRepositoryToken)
    private readonly repo: PlaceRepository.IPlaceRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly logger: AppLogger,
  ) {}

  async createPlace(
    placeData: CreatePlaceDto,
    images: Express.Multer.File[],
    userId: string,
  ): Promise<DefaultResponseDto> {
    if (!images || images.length === 0) {
      throw new BadRequestException('At least one image is required.');
    }

    try {
      const photos = await this.cloudinaryService.uploadImages(
        images,
        'places',
      );
      if (!userId || userId === '') {
        throw new UnauthorizedException('hostID is required.');
      }
      placeData.hostID = userId;

      const dataToSave = { ...placeData, photos: photos };
      await this.repo.createPlace(dataToSave);
      return new DefaultResponseDto({ message: 'Place created successfully' });
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to create place: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to create place.');
    }
  }

  async updatePlace(
    placeId: string,
    place: UpdatePlaceDto,
    images?: Express.Multer.File[],
    userId?: string,
  ): Promise<DefaultResponseDto> {
    try {
      if (!userId || userId === '') {
        throw new UnauthorizedException('hostID is required.');
      }

      const existing = await this.repo.getPlacesByHostId(userId, placeId);

      if (!existing) {
        throw new NotFoundException('Place not found');
      }

      let newPhotos: Photo[] = (existing.photos as unknown as Photo[]) ?? [];

      if (images && images.length > 0) {
        const oldPublicIds =
          (existing?.photos as unknown as Photo[])
            .map((p) => p.public_id)
            .filter(Boolean) || [];

        if (oldPublicIds.length > 0) {
          await this.cloudinaryService.deleteImages(oldPublicIds);
        }

        const uploaded = await this.cloudinaryService.uploadImages(
          images,
          'places',
        );
        newPhotos = uploaded;
      }

      const updatedData = {
        ...place,
        photos: newPhotos as { url: string; public_id: string }[],
      };

      await this.repo.updatePlace(placeId, updatedData);

      return new DefaultResponseDto({ message: 'Place updated successfully' });
    } catch (error: unknown) {
      this.logger.error(
        `Failed to update place: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to update place.');
    }
  }

  async deletePlace(
    placeId: string,
    userId: string,
  ): Promise<DefaultResponseDto> {
    try {
      const existing = await this.repo.getPlacesByHostId(userId, placeId);

      if (!existing) {
        throw new NotFoundException('Place not found');
      }

      await this.repo.deletePlace(placeId);
      return new DefaultResponseDto({ message: 'Place deleted successfully' });
    } catch (error: unknown) {
      this.logger.error(
        `Failed to delete place: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to delete place.');
    }
  }

  async listAllPlaces(): Promise<DefaultResponseDto> {
    try {
      const places = await this.repo.listPlaces();
      const placeEntities = plainToInstance(PlaceEntity, places, {
        excludeExtraneousValues: true,
      });
      return new DefaultResponseDto({
        message: 'Places listed successfully',
        data: placeEntities,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Failed to list places: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to list places.');
    }
  }
  async getPlaceById(placeId: string): Promise<DefaultResponseDto> {
    try {
      const place = await this.repo.getPlaceById(placeId);
      if (!place) {
        throw new NotFoundException('Place not found');
      }
      const placeEntity = plainToInstance(PlaceEntity, place, {
        excludeExtraneousValues: true,
      });
      return new DefaultResponseDto({
        message: 'Place retrieved successfully',
        data: placeEntity,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Failed to get place: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to get place.');
    }
  }
}
