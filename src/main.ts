import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { ValidationPipe } from '@nestjs/common';
import { ApiTimeInterceptor } from './interceptor/api.time.interceptor';
import { swaggerConfig } from './config/swagger.config';
import Redis from './utils/redis.client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  // swagger API
  swaggerConfig(app);

  // api latency interceptor
  app.useGlobalInterceptors(new ApiTimeInterceptor());

  // class-validator pipe
  app.useGlobalPipes(new ValidationPipe());

  // redis connect
  const redis = Redis.getInstance();

  await redis.connect();

  await app.listen(3000);
}
bootstrap();
