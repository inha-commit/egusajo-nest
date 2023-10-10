import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { Request, Response, NextFunction } from 'express';
import { winstonConfig } from './config/winston.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

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
  await app.listen(3000);
}
bootstrap();
