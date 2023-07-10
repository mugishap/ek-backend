import { green } from './../../config/oneliners';
import { Injectable } from '@nestjs/common';
import { ErrorChecker } from '../../custom/custom.decorators';
import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    console.log(green('[ CloudinaryService ] Ready!'));
  }

  @ErrorChecker()
  async uploadFile(
    file: string,
    options: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return await cloudinary.uploader.upload(file, options);
  }
}
