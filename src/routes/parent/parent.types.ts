import { Parent } from './../../schemas/parent.schema';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetParentInfoBody {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ description: "parent's uuid" })
  parentId: string;
}

export class RegisterParent extends PartialType(
  OmitType(Parent, ['password', 'children', 'profileLink']),
) {}

export class RegisterParentBody {
  @ApiProperty({ type: RegisterParent })
  updates: RegisterParent;
}
