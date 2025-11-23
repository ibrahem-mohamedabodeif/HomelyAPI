import { Module } from '@nestjs/common';
import { FacelitiesController } from '../facelities/controller/facelities.controller';
import { FacelitiesService } from '../facelities/service/facelities.service';
import { FacilityRepository } from '../facelities/reposetory/facility.repo';
import { IFacilityRepositoryToken } from './reposetory/placeType.interface';
import { MongooseModule } from '@nestjs/mongoose';
import { Facility, FacilitySchema } from './entity/facility.schema';
import { LoggerModule } from 'src/Core/filters/logger.module';

@Module({
  controllers: [FacelitiesController],
  providers: [
    FacelitiesService,
    {
      provide: IFacilityRepositoryToken,
      useClass: FacilityRepository,
    },
  ],
  exports: [FacelitiesService],
  imports: [
    MongooseModule.forFeature([
      { name: Facility.name, schema: FacilitySchema },
    ]),
    LoggerModule,
  ],
})
export class FacelitiesModule {}
