import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { Request, Response, NextFunction } from 'express';
import { winstonConfig } from './config/winston.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const config = new DocumentBuilder()
    .setTitle('Sleact API')
    .setDescription('Sleact 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // api소요시간, 보낸사람 ip 확인하는 middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const logger = new Logger();
      const duration = Date.now() - start;
      logger.log(
        `[${method}] ${originalUrl} ${ip}-${userAgent} ${statusCode}status-${duration}ms`,
      );
    });
    next();
  });

  // class-validator 글로벌 파이프라인 추가
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
