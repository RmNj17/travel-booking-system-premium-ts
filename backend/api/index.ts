import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { ApiExceptionFilter } from "../src/common/api-exception.filter";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";

const server = express();

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.enableCors({
      origin: true,
      credentials: true,
    });

    app.useGlobalFilters(new ApiExceptionFilter());

    await app.init();
    cachedApp = app;
  }

  return server;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  return app(req, res);
}
