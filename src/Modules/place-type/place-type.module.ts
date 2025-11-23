import { Module } from '@nestjs/common';
import { PlaceTypeController } from './controller/place-type.controller';
import { PlaceTypeService } from './service/placeType.service';
import { PlaceTypeRepository } from './reposetory/placeType.repo';
import { IPlaceTypeRepositoryToken } from './reposetory/placeType.interface';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceType, PlaceTypeSchema } from './entity/placeType.schema';
import { LoggerModule } from 'src/Core/filters/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlaceType.name, schema: PlaceTypeSchema },
    ]),
    LoggerModule,
  ],
  controllers: [PlaceTypeController],
  providers: [
    PlaceTypeService,
    {
      provide: IPlaceTypeRepositoryToken,
      useClass: PlaceTypeRepository,
    },
  ],
  exports: [PlaceTypeService],
})
export class PlaceTypeModule {}
