import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  UpdatableStudent,
  UpdatableEducator,
  UpdatableParent,
} from 'src/routes/settings/settings.types';

export interface Jwt {
  accountType: AccountType;
  id: string;
  isAdmin: boolean;
  schoolId?: string;
}

export class DefaultResponse {
  @ApiProperty()
  code: string;

  @ApiPropertyOptional()
  message?: string | string[];

  @ApiPropertyOptional()
  user?: object;
}

export class LoginResponse extends DefaultResponse {
  token?: string;
  id?: string;
  isAdmin?: boolean;
}

export class ErrorResponse extends DefaultResponse {
  @ApiProperty({ default: '#Error' })
  code: '#Error';

  @ApiProperty()
  message: string;
}

export class SuccessResponse extends DefaultResponse {
  @ApiProperty({ default: '#Success' })
  code: '#Success';
}

export class NoTokenResponse extends DefaultResponse {
  @ApiProperty({ default: '#NoToken' })
  code: '#NoToken';
}

export class ResponseWithResults extends DefaultResponse {
  @ApiProperty()
  results?: object | object[] | string | string[];
}

export type AccountType = 'student' | 'educator' | 'parent' | 'admin';
export type SomeUserSchema =
  | UpdatableStudent
  | UpdatableEducator
  | UpdatableParent;
