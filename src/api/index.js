import { NestFactory } from "@nestjs/core"
import { AppModule } from "../src/app.module"
import { ResponseInterceptor } from "../src/Core/interceptors/response.interceptor"
import { ValidationPipe } from "@nestjs/common"
import cookieParser from "cookie-parser"
import type { Server } from "http"

let cachedServer: Server
let appInitialized = false

export default async function handler(req: any, res: any) {
  if (!appInitialized) {
    const app = await NestFactory.create(AppModule)

    // Configure middleware and pipes before initialization
    app.setGlobalPrefix("api/v1")
    app.use(cookieParser())
    app.useGlobalInterceptors(new ResponseInterceptor())
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,
      }),
    )

    await app.init()
    cachedServer = app.getHttpServer()
    appInitialized = true
  }

  // Handle the request with the cached server
  return cachedServer.emit("request", req, res)
}
