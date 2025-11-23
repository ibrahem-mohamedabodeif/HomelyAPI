/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../types/response.type';

@Injectable()
export class ResponseInterceptor<DefaultResponseDto>
  implements NestInterceptor<DefaultResponseDto, Response<DefaultResponseDto>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<DefaultResponseDto>> {
    const ctx = context.switchToHttp();
    const httpResponse = ctx.getResponse<Response<DefaultResponseDto>>();

    return next.handle().pipe(
      map((data: DefaultResponseDto) => {
        const message =
          typeof data === 'object' && data && 'message' in data
            ? (data.message as string)
            : 'Operation successful';
        const responseData =
          typeof data === 'object' && data && 'data' in data
            ? (data.data as any)
            : data;

        return {
          success: true,
          statusCode: httpResponse.statusCode,
          message: message,
          data: responseData,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
