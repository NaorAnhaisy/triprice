/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as bodyParser from 'body-parser';
import { AppConfigService } from './config/AppConfig.service';
import { loggerFactory } from './utils/Logger/Logger.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: loggerFactory() });
  const configService = app.get<AppConfigService>(AppConfigService);
  app.enableCors();
  app.use(bodyParser.json());
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const backendInsidePort =
    configService.getConfig().portConfiguration.backendInside;
  const appUrl = configService.getConfig().appUrl;
  await app.listen(backendInsidePort);
  Logger.log(
    `🚀 Application is running on: ${appUrl}:${backendInsidePort}/${globalPrefix}`
  );
}

bootstrap();
