import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function swaggerConfig(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Sleact API')
    .setDescription('Sleact 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
