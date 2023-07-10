import { School } from './school.schema';
import { Subject } from './subject.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type EducatorDocument = Educator & mongoose.Document;

@Schema({ strict: true })
export class Educator {
  @Prop({ type: String })
  @ApiProperty()
  names: string;

  @Prop({ type: String })
  @ApiProperty()
  code: string;

  @Prop({ type: [String] })
  @ApiProperty()
  title: string[];

  @Prop({ type: String })
  @ApiProperty()
  tel: string;

  @Prop({ type: String, unique: true })
  @ApiProperty()
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School' })
  @ApiProperty({ type: String })
  school: mongoose.Types.ObjectId | School;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }] })
  @ApiProperty({ type: [String] })
  subjects: mongoose.Types.ObjectId[] | Subject[];

  @Prop({ type: String, default: process.env.DEFAULT_PROFILE })
  profileLink: string;
}

export const EducatorSchema = SchemaFactory.createForClass(Educator);
