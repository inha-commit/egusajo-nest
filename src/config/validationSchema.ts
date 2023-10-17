import Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRE: Joi.string().required(),
  REFRESH_TOKEN_EXPIRE: Joi.string().required(),
});
