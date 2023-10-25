import {
  Controller,
  Get,
  Inject,
  Logger,
  LoggerService,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AccessTokenGuard } from './guard/access.token.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(Logger)
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
