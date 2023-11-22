import { createClient, RedisClientType } from 'redis';
import { Logger } from '@nestjs/common';

class Redis {
  private static instance: Redis;

  private readonly client: RedisClientType;

  private readonly logger: Logger;

  constructor() {
    // if (process.env.NODE_ENV === 'production') {
    //   this.client = createClient({
    //     url: process.env.REDIS_URL,
    //     password: process.env.REDIS_PASSWORD,
    //   });
    // } else {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });
    // }

    this.client.on('connect', () => {
      this.logger.log(`Redis Connected`);
    });
    this.client.on('error', (err) => this.logger.error(err));

    this.logger = new Logger();
  }

  static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }

    return Redis.instance;
  }

  /**
   * redis 연결
   */
  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    this.client.quit();
  }

  getClient(): RedisClientType {
    return this.client;
  }
}

export default Redis;
2;
