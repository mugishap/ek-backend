import { obj_without } from './../../config/oneliners';
import { ApiProperty } from '@nestjs/swagger';
import { DefaultResponse } from '../../config/global.interface';

export class DefaultAuthResponse extends DefaultResponse {
  @ApiProperty()
  token?: string;
}

export class SafeUser<T> {
  constructor(userInfo: T, ...without: string[]) {
    Object.assign(
      this,
      obj_without(userInfo as object, 'password', '__v', ...without),
    );
  }
}
