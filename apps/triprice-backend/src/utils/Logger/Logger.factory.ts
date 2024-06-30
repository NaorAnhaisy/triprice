import { LogLevel, LoggerService } from '@nestjs/common';
import { WinstonModule, utilities as nestWinstonUtilities } from 'nest-winston';
import { join } from 'path';
import { format, level, transports } from 'winston';
const DailyRotateFile = require('winston-daily-rotate-file');

const consoleLogger = new transports.Console({
  format: format.combine(
    format.timestamp(),
    format.ms(),
    nestWinstonUtilities.format.nestLike(process.env.APP_NAME, {
      prettyPrint: true,
      colors: true,
    })
  ),
});

const fileLogger = new DailyRotateFile({
  format: format.combine(format.timestamp(), format.json()),
  filename: join(__dirname, '../../../Logs/%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d',
});

export const loggerFactory = (): LoggerService | LogLevel[] => {
  let logger;

  switch (process.env.NODE_ENV) {
    case 'development':
      logger = WinstonModule.createLogger({
        transports: [consoleLogger, fileLogger],
        level: 'debug',
      });
      break;
    case 'test':
      logger = false;
      break;
    case 'production':
      logger = WinstonModule.createLogger({
        transports: [consoleLogger, fileLogger],
        level: 'info',
      });
      break;
    default:
      logger = WinstonModule.createLogger({
        transports: [consoleLogger, fileLogger],
        level: 'info',
      });
      break;
  }

  return logger;
};
