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

    this.admin = admin.initializeApp({
      credential: admin.credential.cert(credential as unknown),
    });
  }

  async send() {
    const message = {
      data: {
        title: '집',
        body: '가고싶다',
      },
      token: 'token',
    };
    await this.admin.messaging().send(message);
  }
}
