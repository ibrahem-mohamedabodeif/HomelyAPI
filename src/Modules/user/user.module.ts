import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { IUserRepositoryToken } from './reposetory/user.interface';
import { UserRepository } from './reposetory/user.repo';
import { LoggerModule } from 'src/Core/filters/logger.module';
import { MongooseModule } from '@nestjs/mongoose';
import { user, UserSchema } from './entity/user.schema';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: IUserRepositoryToken,
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: user.name, schema: UserSchema }]),
    LoggerModule,
  ],
})
export class UserModule {}
