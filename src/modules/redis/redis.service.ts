import { Inject, Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  // private readonly client: RedisClientType;

  private logger: Logger;

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly client: RedisClientType,
  ) {
    this.logger = new Logger();
  }

  async saveRedisFcmToken(userId: number, fcmToken: string): Promise<void> {
    await this.client.set(userId.toString(), fcmToken);
  }

  async getFcmToken(userId: number): Promise<string> {
    return this.client.get(userId.toString());
  }
}
