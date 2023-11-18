import { Injectable } from '@nestjs/common';
import { FcmApiClient } from './utils/fcm.api.client';

@Injectable()
export class AppService {
  private fcmApiClient: FcmApiClient;

  constructor() {
    this.fcmApiClient = new FcmApiClient();
  }

  getHello(): string {
    this.fcmApiClient.send();
    return 'Server working';
  }
}
