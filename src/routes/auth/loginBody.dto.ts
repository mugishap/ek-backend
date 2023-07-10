import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, ValidateIf } from 'class-validator';
export class LoginBody {
  @IsNotEmpty()
  @ApiProperty()
  accountType: string;

  @IsNotEmpty()
  @ApiProperty()
  emailorcode: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @ValidateIf(({ school }) => !!school)
  @IsMongoId({ message: 'school paremeter must be a mongodb ID' })
  @ApiPropertyOptional()
  school?: string;
}
