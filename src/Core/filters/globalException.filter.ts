import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppLogger } from './logger.service';
import { Response, Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(
      `Exception caught: ${
        exception instanceof Error
          ? exception.message
          : JSON.stringify(exception)
      }`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
      request.url,
      request.method,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message:
        exception instanceof HttpException
          ? exception.message
          : 'Something went wrong',
      timestamp: new Date().toISOString(),
    });
  }
}
