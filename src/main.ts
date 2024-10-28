import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { appCreate } from './app.create';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Add middleware
  appCreate(app);
  await app.listen(3000);
}
bootstrap();