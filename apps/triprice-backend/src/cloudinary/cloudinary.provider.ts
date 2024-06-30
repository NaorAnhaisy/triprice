import { ConfigOptions, v2 } from 'cloudinary';
import { AppConfigService } from '../config/AppConfig.service';
import { AppConfigModule } from '../config/AppConfig.module';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  imports: [AppConfigModule],
  inject: [AppConfigService],
  useFactory: (configService: AppConfigService): ConfigOptions => {
    return v2.config({
      cloud_name: configService.getConfig().cloudinary.cloud_name,
      api_key: configService.getConfig().cloudinary.api_key,
      api_secret: configService.getConfig().cloudinary.api_secret,
    });
  },
};
