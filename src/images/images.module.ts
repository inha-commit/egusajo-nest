import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, JwtService],
})
export class ImagesModule {}
