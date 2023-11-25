import admin from 'firebase-admin';
import { Logger } from '@nestjs/common';

type FcmMessage = {
  data: {
    title: string; // 알림 메세지 제목
    body: string; // 알림 메세지 내용
    code: string; // 알림 메세지 구분 코드
  };
  token: string; // 사용자 Fcm Token
};

export class FcmApiClient {
  private credential;

  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger();

    const { privateKey } = JSON.parse(process.env.FCM_CREDENTIAL_PRIVATE_KEY);

    this.credential = {
      type: process.env.FCM_CREDENTIAL_TYPE,
      project_id: process.env.FCM_CREDENTIAL_PROJECT_ID,
      private_key_id: process.env.FCM_CREDENTIAL_PRIVATE_KEY_ID,
      client_email: process.env.FCM_CREDENTIAL_CLIENT_EMAIL,
      client_id: process.env.FCM_CREDENTIAL_CLIENT_ID,
      auth_uri: process.env.FCM_CREDENTIAL_AUTH_URI,
      token_uri: process.env.FCM_CREDENTIAL_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FCM_CREDENTIAL_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FCM_CREDENTIAL_CLIENT_CERT_URL,
      universe_domain: process.env.FCM_CREDENTIAL_UNIVERSE_DOMAIN,
      private_key: privateKey,
    };

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(this.credential as unknown),
      });
    }
  }

  private createMessage(
    title: string,
    body: string,
    code: string,
    token: string,
  ) {
    return {
      data: { title, body, code },
      token: token,
    };
  }

  private async sendMessage(message: FcmMessage) {
    try {
      if (process.env.NODE_ENV === 'production') {
        await admin.messaging().send(message);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async sendNewFundingNotification(
    senderNickname: string,
    cost: number,
    fcmToken: string,
  ) {
    const title = '펀딩 도착 알림';
    const body = `${senderNickname}님이 ${cost}원을 펀딩해 주셨어요!`;
    const code = 'fund';

    const message = this.createMessage(title, body, code, fcmToken);
    await this.sendMessage(message);
  }

  async sendCompleteFundingNotification(fcmToken: string) {
    const title = '펀딩 마감 알림';
    const body = '펀딩이 마감되었어요!';
    const code = 'complete';

    const message = this.createMessage(title, body, code, fcmToken);
    await this.sendMessage(message);
  }

  async sendNewFollowerNotification(userNickname: string, fcmToken: string) {
    const title = '친구 요청 알림';
    const body = `${userNickname}님이 친구가 되고 싶어해요`;
    const code = 'follow';

    const message = this.createMessage(title, body, code, fcmToken);
    await this.sendMessage(message);
  }

  async sendFollowAcceptNotification(userNickname: string, fcmToken: string) {
    const title = '친구 요청 수락 알림';
    const body = `${userNickname}님과 친구가 되었어요!`;
    const code = 'accept';

    const message = this.createMessage(title, body, code, fcmToken);
    await this.sendMessage(message);
  }
}
