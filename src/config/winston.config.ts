import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('Nest', {
          prettyPrint: true,
        }),
      ),
    }),
  ],
};
