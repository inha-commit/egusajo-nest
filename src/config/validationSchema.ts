import Joi from 'joi';

export const validationSchema = Joi.object({
  TEST_VARIABLE: Joi.number().required(),
});
