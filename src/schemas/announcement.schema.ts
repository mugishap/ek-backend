import { AccountType } from './../config/global.interface';
import { Educator } from './educator.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type AnnouncementDocument = Announcement & mongoose.Document;

@Schema({ strict: true })
export class Announcement {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Educator' })
  @ApiProperty({ type: String, description: 'Educator _id' })
  composer: mongoose.Types.ObjectId | Educator;

  @Prop()
  @ApiProperty()
  title: string;

  @Prop()
  @ApiProperty()
  content: string;

  @Prop({ default: Date.now() })
  @ApiProperty({})
  date: Date;

  @Prop({ default: Date.now() + 2592000000 })
  @ApiProperty()
  expiry: Date;

  @Prop()
  @ApiProperty()
  meantFor: AccountType[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School' })
  school: mongoose.Types.ObjectId | string;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
