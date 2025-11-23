import { Module } from '@nestjs/common';
import { PlaceController } from './controller/place.controller';
import { PlaceService } from './service/place.service';
import { IPlaceRepositoryToken } from './reposetory/place.interface';
import { PlaceRepository } from './reposetory/place.repo';
import { CloudinaryModule } from 'src/Core/cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { LoggerModule } from 'src/Core/filters/logger.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from './entity/place.schema';

@Module({
  controllers: [PlaceController],
  providers: [
    {
      provide: IPlaceRepositoryToken,
      useClass: PlaceRepository,
    },
    PlaceService,
  ],
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
    CloudinaryModule,
    LoggerModule,
    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per image
    }),
  ],
})
export class PlaceModule {}
