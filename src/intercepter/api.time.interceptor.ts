// src/interceptors/logging.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SlackApiClient } from '../utils/slack.api.client';

@Injectable()
export class ApiTimeInterceptor implements NestInterceptor {
  private logger: Logger;
  private slackClient: SlackApiClient;

  constructor() {
    this.logger = new Logger();
    this.slackClient = new SlackApiClient();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const { method, originalUrl } = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const duration = Date.now() - start;

        if (statusCode < 400) {
          this.logger.log(`[${method}] ${originalUrl} ${duration}ms`);
        } else if (statusCode < 500) {
          this.logger.warn(`[${method}] ${originalUrl} ${duration}ms`);
        } else {
          this.logger.error(`[${method}] ${originalUrl} ${duration}ms`);
        }

        if (duration > 2000) {
          this.slackClient.sendApiLatency(method, originalUrl, duration);
        }
      }),
    );
  }
}
