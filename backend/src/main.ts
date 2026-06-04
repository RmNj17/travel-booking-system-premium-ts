import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ApiExceptionFilter } from "./common/api-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalFilters(new ApiExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Travel Booking API running on port ${port}`);
}

bootstrap();
