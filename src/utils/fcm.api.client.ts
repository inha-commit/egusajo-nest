import admin from 'firebase-admin';

export class FcmApiClient {
  private admin: admin.app.App;

  constructor() {
    const credential = {
      type: process.env.FCM_CREDENTIAL_TYPE,
      project_id: process.env.FCM_CREDENTIAL_PROJECT_ID,
      private_key_id: process.env.FCM_CREDENTIAL_PRIVATE_KEY_ID,
      private_key: process.env.FCM_CREDENTIAL_PRIVATE_KEY,
      client_email: process.env.FCM_CREDENTIAL_CLIENT_EMAIL,
      client_id: process.env.FCM_CREDENTIAL_CLIENT_ID,
      auth_uri: process.env.FCM_CREDENTIAL_AUTH_URI,
      token_uri: process.env.FCM_CREDENTIAL_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FCM_CREDENTIAL_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FCM_CREDENTIAL_CLIENT_CERT_URL,
      universe_domain: process.env.FCM_CREDENTIAL_UNIVERSE_DOMAIN,
    };

    if (admin.apps.length === 0) {
      this.admin = admin.initializeApp({
        credential: admin.credential.cert(credential as unknown),
      });
    }
  }

  async newFundingMessage(
    senderNickname: string,
    money: number,
    fcmToken: string,
  ) {
    try {
      if (process.env.NODE_ENV === 'production') {
        const message = {
          data: {
            title: '펀딩 도착 알림',
            body: `${senderNickname}님이 ${money}원을 펀딩해 주셨어요!`,
          },
          token: fcmToken,
        };

        await this.admin.messaging().send(message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async completeFundingMessage(fcmToken: string) {
    try {
      if (process.env.NODE_ENV === 'production') {
        const message = {
          data: {
            title: '펀딩 마감 알림',
            body: `펀딩이 마감되었어요!`,
          },
          token: fcmToken,
        };

        await this.admin.messaging().send(message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async newFollowerMessage(userNickname: string, fcmToken: string) {
    try {
      if (process.env.NODE_ENV === 'production') {
        const message = {
          data: {
            title: '친구 요청 알림',
            body: `${userNickname}님이 친구가 되고 싶어해요`,
          },
          token: fcmToken,
        };

        await this.admin.messaging().send(message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async followAcceptMessage(userNickname: string, fcmToken: string) {
    try {
      if (process.env.NODE_ENV === 'production') {
        const message = {
          data: {
            title: '친구 요청 수락 알림',
            body: `${userNickname}님과 친구가 되었어요!`,
          },
          token: fcmToken,
        };

        await this.admin.messaging().send(message);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
