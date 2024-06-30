import { Injectable } from '@nestjs/common';
import { v2, UploadApiOptions } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(imagePath: string): Promise<string> {
    const options: UploadApiOptions = {
      resource_type: 'image',
    };

    const result = await v2.uploader.upload(imagePath, {
      options,
    });
    return result.secure_url;
  }
}
