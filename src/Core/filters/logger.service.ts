import { Injectable, LoggerService } from '@nestjs/common';
@Injectable()
export class AppLogger implements LoggerService {
  // private isProd = process.env.NODE_ENV == 'production';

  log(message: any, context?: string) {
    console.log(`🟢 [LOG]${context ? ` [${context}]` : ''}:`, message);
  }
  warn(message: any, context?: string) {
    console.warn(`🟠 [WARN]${context ? ` [${context}]` : ''}:`, message);
  }

  error(message: any, trace?: string, context?: string, method?: string) {
    console.error(
      `🔴 [ERROR]${context ? ` [${method} ${context}]` : ''}:`,
      message,
    );
    console.error(trace);
  }

  debug(message: any, context?: string) {
    console.debug(`🟣 [DEBUG]${context ? ` [${context}]` : ''}:`, message);
  }

  verbose(message: any, context?: string) {
    console.info(`🔵 [VERBOSE]${context ? ` [${context}]` : ''}:`, message);
  }
}
