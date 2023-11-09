import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { ValidationPipe } from '@nestjs/common';
import { ApiTimeInterceptor } from './intercepter/api.time.interceptor';
import { swaggerConfig } from './config/swagger.config';

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

  await app.listen(3000);
}
bootstrap();
