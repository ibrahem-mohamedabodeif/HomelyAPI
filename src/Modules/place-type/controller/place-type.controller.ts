import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PlaceTypeService } from '../service/placeType.service';
import { CreatePlaceTypeDto } from '../dto/createPlaceType.dto';
import { UpdatePlaceTypeDto } from '../dto/updatePlaceType.dto';
import { AuthGuard } from 'src/Core/guards/auth.guard';
import { RolesGuard } from 'src/Core/guards/Roles.guard';
import { Roles } from 'src/Core/decorators/roles.decorator';
import { Role } from 'src/Core/types/role.enum';

@Controller('place-type')
export class PlaceTypeController {
  constructor(private readonly placeTypeService: PlaceTypeService) {}

  @Get()
  getAllPlaceTypes() {
    return this.placeTypeService.getAll();
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Host, Role.Admin)
  @Post()
  createPlaceType(@Body() type: CreatePlaceTypeDto) {
    return this.placeTypeService.create(type);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Host, Role.Admin)
  @Patch(':id')
  updatePlaceType(@Param('id') id: string, @Body() type: UpdatePlaceTypeDto) {
    return this.placeTypeService.update(id, type);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Host, Role.Admin)
  @Delete(':id')
  deletePlaceType(@Param('id') id: string) {
    return this.placeTypeService.delete(id);
  }
}
