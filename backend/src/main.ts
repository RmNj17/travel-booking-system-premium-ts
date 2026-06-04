import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/api-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5173' });
  app.useGlobalFilters(new ApiExceptionFilter());
  await app.listen(3000);
  console.log('Travel Booking API running on http://localhost:3000');
}
bootstrap();
