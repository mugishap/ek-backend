import { Student } from './student.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export type ParentDocument = Parent & mongoose.Document;

@Schema({ strict: true })
export class Parent {
  @Prop({ type: String })
  @ApiProperty()
  names: string;

  @Prop({ type: String })
  @ApiProperty()
  tel: string;

  @Prop({ type: String, unique: true })
  @ApiProperty()
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }] })
  @ApiProperty()
  children: mongoose.Types.ObjectId[] | Student[];

  @Prop({ type: String, default: process.env.DEFAULT_PROFILE })
  @ApiProperty()
  profileLink: string;
}

export const ParentSchema = SchemaFactory.createForClass(Parent);

export class SafeParent implements Parent {
  @Exclude()
  password: string;

  names: string;

  tel: string;

  email: string;

  children: mongoose.Types.ObjectId[] | Student[];

  profileLink: string;

  constructor(data: Partial<SafeParent>) {
    Object.assign(this, data);
  }
}
