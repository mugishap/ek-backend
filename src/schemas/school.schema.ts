import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import * as mongoose from 'mongoose';

export type SchoolDocument = School & mongoose.Document;

export class SchoolAddress {
  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  district: string;

  @IsString()
  sector?: string;

  @IsString()
  cell?: string;

  @IsString()
  village?: string;
}

@Schema({ strict: true })
export class School {
  // =====> PART 1: BASIC INFO
  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  initials: string;

  @ApiProperty({
    enum: ['government-aided', 'government', 'private'],
    example: ['government-aided', 'government', 'private'],
  })
  @Prop({
    type: String,
    required: true,
    enum: {
      values: ['government-aided', 'government', 'private'],
      message:
        "{VALUE} is not a valid school type, choose between 'government-aided', 'government', 'private'",
    },
  })
  type: string;

  @ApiProperty()
  @Prop({
    type: [String],
    required: true,
    enum: {
      values: ['Cambridge', 'REB', 'WDA', 'Other'],
      message: '{VALUE} is not a valid choice of programme',
    },
  })
  programme: string[];

  // =====> PART 2: WHEREABOUTS

  @ApiProperty()
  @Prop({ type: SchoolAddress, required: true })
  address: SchoolAddress;

  // =====> PART 3: MORE ABOUT THE SCHOOL

  @ApiProperty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Educator',
    required: false,
  })
  head?: string | mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: String })
  moto?: string;

  @ApiProperty()
  @Prop({ type: String })
  profileLink: string;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now() })
  joined: Date;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
