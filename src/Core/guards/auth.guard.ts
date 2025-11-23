import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from 'src/Modules/auth/service/tokens.service';
import { SessionService } from 'src/Modules/auth/service/session.service';
import { Payload } from '../types/payload.type';

type AuthRequest = Request & { user?: Payload };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException(
        'You must be logged in to access this resource',
      );
    }

    try {
      const payload = (await this.tokenService.verifyAccessToken(
        token,
      )) as Payload;

      if (!payload || typeof payload !== 'object') {
        throw new UnauthorizedException('Invalid token payload');
      }

      if (payload.sid) {
        const sid = payload.sid;
        const session = await this.sessionService.findSessionById(sid);
        if (!session) {
          throw new UnauthorizedException('Session not found or revoked');
        }
      }

      (req as AuthRequest).user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
