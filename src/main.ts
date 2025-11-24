// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ResponseInterceptor } from './Core/interceptors/response.interceptor';
// import { ValidationPipe } from '@nestjs/common';
// import cookieParser from 'cookie-parser';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.use(cookieParser());

//   app.useGlobalInterceptors(new ResponseInterceptor());
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       forbidUnknownValues: true,
//       transform: true,
//     }),
//   );

//   app.setGlobalPrefix('api/v1');
//   await app.listen(process.env.PORT ?? 3000);
// }
// void bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './Core/interceptors/response.interceptor';
import cookieParser from 'cookie-parser';
import { Server } from 'http';

let cachedServer: Server;

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api/v1');

    await app.init();
    cachedServer = app.getHttpServer();
  }

  return cachedServer.emit('request', req, res);
}
