import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as placeTypeInterface from '../reposetory/placeType.interface';
import { CreatePlaceTypeDto } from '../dto/createPlaceType.dto';
import { UpdatePlaceTypeDto } from '../dto/updatePlaceType.dto';
import { PlaceTypeEntity } from '../entity/placeType.entity';
import { plainToInstance } from 'class-transformer';
import { DefaultResponseDto } from 'src/Core/types/defaultResponse.dto';
import { AppLogger } from 'src/Core/filters/logger.service';

@Injectable()
export class PlaceTypeService {
  constructor(
    @Inject(placeTypeInterface.IPlaceTypeRepositoryToken)
    private readonly repo: placeTypeInterface.IPlaceTypeRepository,
    private readonly logger: AppLogger,
  ) {}
  async create(type: CreatePlaceTypeDto): Promise<DefaultResponseDto> {
    try {
      const existingType = await this.repo.getByType(type.type);
      if (existingType) {
        throw new BadRequestException('Place type already exists.');
      }
      await this.repo.create(type);
      return new DefaultResponseDto({
        message: 'Place type created successfully.',
      });
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Failed to create place type: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );

      throw new InternalServerErrorException('Failed to create place type.');
    }
  }
  async update(
    id: string,
    type: UpdatePlaceTypeDto,
  ): Promise<DefaultResponseDto> {
    try {
      const existingType = await this.repo.getById(id);
      if (!existingType) {
        throw new BadRequestException('Place type not found.');
      }
      const existing = await this.repo.getByType(type.type as string);
      if (existing) {
        throw new BadRequestException('Place type already exists.');
      }
      await this.repo.update(id, type);
      return new DefaultResponseDto({
        message: 'Place type updated successfully.',
      });
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Failed to update place type: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to update place type.');
    }
  }

  async getAll(): Promise<DefaultResponseDto> {
    try {
      const placeTypes = await this.repo.getAll();
      const placeTypeEntities = plainToInstance(PlaceTypeEntity, placeTypes, {
        excludeExtraneousValues: true,
      });
      return new DefaultResponseDto({
        message: 'Place types retrieved successfully.',
        data: placeTypeEntities,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Failed to retrieve place types: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to retrieve place types.');
    }
  }

  async delete(id: string): Promise<DefaultResponseDto> {
    try {
      const existingType = await this.repo.getById(id);
      if (!existingType) {
        throw new NotFoundException('Place type not found.');
      }
      await this.repo.delete(id);
      return new DefaultResponseDto({
        message: 'Place type deleted successfully.',
      });
    } catch (error: unknown) {
      this.logger.error(
        `Failed to delete place type: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to delete place type.');
    }
  }
}
