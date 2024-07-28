import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { randomInt } from 'crypto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(randomInt(3000));
}
bootstrap();
