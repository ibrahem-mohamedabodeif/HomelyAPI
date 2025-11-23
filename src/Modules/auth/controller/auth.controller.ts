/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignupDto } from '../dto/signup.dto';
import type { Response, Request } from 'express';
import { TokenService } from '../service/tokens.service';
import { SigninDto } from '../dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}
  @Post('signup')
  async signup(@Body() user: SignupDto) {
    return await this.authService.signup(user);
  }

  @Post('signin')
  async signin(
    @Body() credintials: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signin(credintials);
    const accessToken = result.data?.accessToken as string;
    const refreshToken = result.data?.refreshToken as string;

    this.tokenService.setAuthCookies(res, refreshToken);
    return { accessToken };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'] as string | undefined;
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    const result = await this.authService.refreshTokens(refreshToken);

    const newAccess = result.data.accessToken;
    const newRefresh = result.data.refreshToken;

    this.tokenService.setAuthCookies(res, newRefresh);

    return { accessToken: newAccess };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(req, res);
  }
}
