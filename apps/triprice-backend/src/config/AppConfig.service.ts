import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfiguration } from './AppConfig.factory';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  public getConfig(): IConfiguration {
    return this.configService.get('config', { infer: true });
  }
}
