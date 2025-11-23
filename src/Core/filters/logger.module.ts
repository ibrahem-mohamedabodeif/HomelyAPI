import { Module } from '@nestjs/common';
import { AppLogger } from './logger.service';
import { GlobalExceptionFilter } from './globalException.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    AppLogger,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [AppLogger],
})
export class LoggerModule {}
