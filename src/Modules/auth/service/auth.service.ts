import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { UserService } from 'src/Modules/user/service/user.service';
import { TokenService } from './tokens.service';
import { AppLogger } from 'src/Core/filters/logger.service';
import { SigninDto } from '../dto/signin.dto';
import * as bcrypt from 'bcryptjs';
import { SessionService } from './session.service';
import { Request, Response } from 'express';
import { DefaultResponseDto } from 'src/Core/types/defaultResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLogger,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
  ) {}

  async signup(user: SignupDto): Promise<DefaultResponseDto> {
    if (user.confirmPassword !== user.password) {
      throw new BadRequestException('Passwords Does not match');
    }

    try {
      const existingUser = await this.userService.findByEmail(user.email);
      if (existingUser) {
        throw new BadRequestException(
          'This Email already exists, please login.',
        );
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;

      await this.userService.create(user);
      // const payload = { sub: newUser.id, role: newUser.role };
      // const accessToken = await this.tokenService.generateAccessToken(payload);

      // const session = await this.sessionService.createSession({
      //   userId: newUser.id,
      // });

      // const refreshToken = await this.tokenService.generateRefreshToken({
      //   sub: newUser.id,
      //   sid: session._id.toString(),
      // });

      // await this.sessionService.updateRefreshToken(
      //   session._id.toString(),
      //   refreshToken,
      // );

      // return {
      //   accessToken,
      //   refreshToken,
      // };

      return new DefaultResponseDto({ message: 'User created successfully' });
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Failed to create user: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  async signin(credintials: SigninDto): Promise<DefaultResponseDto> {
    try {
      const user = await this.userService.findByEmail(credintials.email);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }
      const isPasswordValid = await bcrypt.compare(
        credintials.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }
      const session = await this.sessionService.createSession({
        userId: user.id,
      });

      const payload = {
        sub: user.id,
        role: user.role,
        sid: session._id.toString(),
      };
      const accessToken = await this.tokenService.generateAccessToken(payload);

      const refreshToken = await this.tokenService.generateRefreshToken({
        sub: user.id,
        sid: session._id.toString(),
      });
      await this.sessionService.updateRefreshToken(
        session._id.toString(),
        refreshToken,
      );

      return new DefaultResponseDto({
        message: 'Signin successful',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(
        `Failed to signin user: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to signin user.');
    }
  }

  async refreshTokens(
    presentedRefreshToken: string,
  ): Promise<DefaultResponseDto> {
    try {
      const payload = await this.tokenService.verifyRefreshToken(
        presentedRefreshToken,
      );
      const { sub: userId, sid } = payload as { sub: string; sid: string };
      if (!userId || !sid)
        throw new UnauthorizedException('Invalid token payload');

      const isValid = await this.sessionService.validateRefreshToken(
        sid,
        presentedRefreshToken,
      );
      if (!isValid) {
        await this.sessionService.deleteSessionById(sid);
        throw new UnauthorizedException('Refresh token revoked or invalid');
      }

      const user = await this.userService.findById(userId);
      if (!user) throw new UnauthorizedException('User not found');

      const accessPayload = { sub: userId, role: user.role, sid };
      const newAccessToken =
        await this.tokenService.generateAccessToken(accessPayload);

      const newRefreshToken = await this.tokenService.generateRefreshToken({
        sub: userId,
        sid,
      });

      await this.sessionService.updateRefreshToken(sid, newRefreshToken);

      return new DefaultResponseDto({
        message: 'Tokens refreshed successfully',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(
        `Failed to refresh tokens: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to refresh tokens.');
    }
  }

  async logout(req: Request, res: Response): Promise<DefaultResponseDto> {
    try {
      const refreshToken = req.cookies['refreshToken'] as string | undefined;

      if (!refreshToken) {
        throw new UnauthorizedException('No refresh token found');
      }

      let payload: { sid: string };
      try {
        payload = await this.tokenService.verifyRefreshToken(refreshToken);
      } catch {
        res.clearCookie('refreshToken');
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const deleted = await this.sessionService.deleteSessionById(payload.sid);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
      });
      // Also clear access token cookie if client stored it as a cookie
      res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
      });

      if (!deleted) {
        this.logger.warn(`Session ${payload.sid} already deleted or not found`);
      }

      return new DefaultResponseDto({
        message: 'Logged out successfully',
      });
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(
        `Failed to logout user: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Failed to logout user.');
    }
  }
}
