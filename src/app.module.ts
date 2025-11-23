import { Module } from '@nestjs/common';
import { DatabaseModule } from './Core/database/db.module';
import { PlaceModule } from './Modules/place/place.module';
import { PlaceTypeModule } from './Modules/place-type/place-type.module';
import { FacelitiesModule } from './Modules/facelities/facelities.module';
import { CloudinaryModule } from './Core/cloudinary/cloudinary.module';

import { LoggerModule } from './Core/filters/logger.module';
import { UserModule } from './Modules/user/user.module';
import { AuthModule } from './Modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CloudinaryModule,
    LoggerModule,
    PlaceModule,
    PlaceTypeModule,
    FacelitiesModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
