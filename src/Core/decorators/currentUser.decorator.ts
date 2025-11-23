import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Payload } from '../types/payload.type';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = (request as Request & { user?: Payload }).user;

    if (!user) throw new UnauthorizedException('User not found');
    if (!data) return user;
    if (data === 'sub') return user.sub;
    return (user as Record<string, unknown>)[data];
  },
);
