import admin from 'firebase-admin';

export class FcmApiClient {
  private admin: admin.app.App;
  private credential;

  constructor() {
    let firebaseConfig;
    try {
      firebaseConfig = require('./firebase.config.json');

      this.credential = {
        type: firebaseConfig.type,
        project_id: firebaseConfig.project_id,
        private_key_id: firebaseConfig.private_key_id,
        private_key: firebaseConfig.private_key,
        client_email: firebaseConfig.client_email,
        client_id: firebaseConfig.client_id,
        auth_uri: firebaseConfig.auth_uri,
        token_uri: firebaseConfig.token_uri,
        auth_provider_x509_cert_url: firebaseConfig.auth_provider_x509_cert_url,
        client_x509_cert_url: firebaseConfig.client_x509_cert_url,
        universe_domain: firebaseConfig.universe_domain,
      };

      if (admin.apps.length === 0) {
        this.admin = admin.initializeApp({
          credential: admin.credential.cert(this.credential as unknown),
        });
      }
    } catch (error) {
      // 파일이 없는 경우 에러가 발생할 것이므로, 에러를 무시하고 빈 객체로 초기화합니다.
      firebaseConfig = {};
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
