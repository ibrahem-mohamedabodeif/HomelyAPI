import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PlaceService } from '../service/place.service';
import { CreatePlaceDto } from '../dto/createPlace.dto';
import { UpdatePlaceDto } from '../dto/updatePlace.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { AuthGuard } from 'src/Core/guards/auth.guard';
import { RolesGuard } from 'src/Core/guards/Roles.guard';
import { Roles } from 'src/Core/decorators/roles.decorator';
import { Role } from 'src/Core/types/role.enum';
import { CurrentUser } from 'src/Core/decorators/currentUser.decorator';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: multer.memoryStorage(),
    }),
  )
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Host, Role.Admin)
  async createPlace(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPlaceDto: CreatePlaceDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.placeService.createPlace(createPlaceDto, files, userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Host, Role.Admin)
  @Patch(':placeId')
  async updatePlace(
    @Param('placeId') placeId: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser('sub') userId: string,
  ) {
    return this.placeService.updatePlace(
      placeId,
      updatePlaceDto,
      files,
      userId,
    );
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Host, Role.Admin)
  @Delete(':placeId')
  async deletePlace(
    @Param('placeId') placeId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.placeService.deletePlace(placeId, userId);
  }

  @Get()
  async listPlaces() {
    return this.placeService.listAllPlaces();
  }

  @Get(':placeId')
  async getPlaceById(@Param('placeId') placeId: string) {
    return this.placeService.getPlaceById(placeId);
  }
}
