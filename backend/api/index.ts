import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import serverlessExpress from "@vendia/serverless-express";
import { AppModule } from "../src/app.module";

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: ["http://localhost:5173", process.env.FRONTEND_URL || ""],
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}
