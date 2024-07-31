import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './shared/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.app.port ?? 3002);
}
bootstrap();
