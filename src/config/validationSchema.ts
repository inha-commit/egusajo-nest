import Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),

  REDIS_URL: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),

  BASIC_PROFILE_IMAGE_SRC: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRE: Joi.string().required(),
  REFRESH_TOKEN_EXPIRE: Joi.string().required(),

  S3_ACCESS_KEY: Joi.string().required(),
  S3_SECRET_KEY: Joi.string().required(),
  S3_BUCKET_NAME: Joi.string().required(),
  S3_REGION: Joi.string().required(),

  SLACK_BOT_TOKEN: Joi.string().required(),
  SLACK_NEW_USER_CHANNEL_ID: Joi.string().required(),
  SLACK_API_LATENCY_CHANNEL_ID: Joi.string().required(),
  SLACK_FATAL_ERROR_CHANNEL_ID: Joi.string().required(),

  FCM_CREDENTIAL_TYPE: Joi.string().required(),
  FCM_CREDENTIAL_PROJECT_ID: Joi.string().required(),
  FCM_CREDENTIAL_PRIVATE_KEY_ID: Joi.string().required(),
  FCM_CREDENTIAL_CLIENT_EMAIL: Joi.string().required(),
  FCM_CREDENTIAL_CLIENT_ID: Joi.string().required(),
  FCM_CREDENTIAL_AUTH_URI: Joi.string().required(),
  FCM_CREDENTIAL_TOKEN_URI: Joi.string().required(),
  FCM_CREDENTIAL_AUTH_PROVIDER_CERT_URL: Joi.string().required(),
  FCM_CREDENTIAL_CLIENT_CERT_URL: Joi.string().required(),
  FCM_CREDENTIAL_UNIVERSE_DOMAIN: Joi.string().required(),
  FCM_CREDENTIAL_PRIVATE_KEY: Joi.string().required(),
});
