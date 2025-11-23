import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as facilityrepo from '../reposetory/placeType.interface';
import { createFacilityDto } from '../dto/createFacility.dto';
import { updateFacilityDto } from '../dto/updateFacility.dto';
import { plainToInstance } from 'class-transformer';
import { FacilityEntity } from '../entity/facility.entity';
import { DefaultResponseDto } from 'src/Core/types/defaultResponse.dto';
import { AppLogger } from 'src/Core/filters/logger.service';

@Injectable()
export class FacelitiesService {
  constructor(
    @Inject(facilityrepo.IFacilityRepositoryToken)
    private readonly facilityRepository: facilityrepo.IFacilityRepository,
    private readonly logger: AppLogger,
  ) {}

  async createFacility(
    facilityData: createFacilityDto,
  ): Promise<DefaultResponseDto> {
    try {
      const existingFacility = await this.facilityRepository.getByTitle(
        facilityData.title,
      );
      if (existingFacility) {
        throw new BadRequestException('Facility already exists');
      }
      await this.facilityRepository.create(facilityData);
      return new DefaultResponseDto({
        message: 'Facility created successfully',
      });
    } catch (error: unknown) {
      this.logger.error(
        `Failed to create facility: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to create facility');
    }
  }
  async updateFacility(
    id: string,
    facilityData: updateFacilityDto,
  ): Promise<DefaultResponseDto> {
    try {
      const existingFacility = await this.facilityRepository.getById(id);
      if (!existingFacility) {
        throw new NotFoundException('Facility not found');
      }

      await this.facilityRepository.update(id, facilityData);
      return new DefaultResponseDto({
        message: 'Facility updated successfully',
      });
    } catch (error: unknown) {
      this.logger.error(
        `Failed to update facility: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );

      throw new InternalServerErrorException('Failed to update facility');
    }
  }

  async getAllFacilities(): Promise<DefaultResponseDto> {
    try {
      const facilities = await this.facilityRepository.getAll();
      const facilityEntities = plainToInstance(FacilityEntity, facilities, {
        excludeExtraneousValues: true,
      });
      return new DefaultResponseDto({
        message: 'Facilities retrieved successfully',
        data: facilityEntities,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Failed to get facilities: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to get facilities');
    }
  }

  async deleteFacility(id: string): Promise<DefaultResponseDto> {
    try {
      const facility = await this.facilityRepository.delete(id);
      if (!facility) {
        throw new NotFoundException('Facility not found');
      }
      return new DefaultResponseDto({
        message: 'Facility deleted successfully',
      });
    } catch (error: unknown) {
      this.logger.error(
        `Failed to delete facility: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to delete facility');
    }
  }
}
