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
import { FacelitiesService } from '../service/facelities.service';
import { createFacilityDto } from '../dto/createFacility.dto';
import { updateFacilityDto } from '../dto/updateFacility.dto';
import { Roles } from 'src/Core/decorators/roles.decorator';
import { Role } from 'src/Core/types/role.enum';
import { AuthGuard } from 'src/Core/guards/auth.guard';

@UseGuards(AuthGuard)
@Roles(Role.Host, Role.Admin)
@Controller('facelities')
export class FacelitiesController {
  constructor(private readonly facilityService: FacelitiesService) {}

  @Post()
  create(@Body() facilityData: createFacilityDto) {
    return this.facilityService.createFacility(facilityData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() facilityData: updateFacilityDto) {
    return this.facilityService.updateFacility(id, facilityData);
  }

  @Get()
  findAll() {
    return this.facilityService.getAllFacilities();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facilityService.deleteFacility(id);
  }
}
