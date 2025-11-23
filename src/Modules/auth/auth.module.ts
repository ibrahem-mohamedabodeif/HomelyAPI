import { Global, Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { LoggerModule } from 'src/Core/filters/logger.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './service/tokens.service';
import { SessionService } from './service/session.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './entity/session.schema';
import { AuthGuard } from 'src/Core/guards/auth.guard';
import { RolesGuard } from 'src/Core/guards/Roles.guard';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, SessionService, AuthGuard, RolesGuard],
  exports: [AuthService, TokenService, SessionService, AuthGuard, RolesGuard],
  imports: [
    JwtModule.register({
      global: true,
    }),
    UserModule,
    LoggerModule,
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
})
export class AuthModule {}
