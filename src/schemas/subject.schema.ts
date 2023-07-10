import { School } from './school.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type SubjectDocument = Subject & mongoose.Document;

@Schema({ strict: true })
export class Subject {
  @Prop({ type: String, unique: true, lowercase: true, trim: true })
  title: string;

  @Prop({ type: String })
  code: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'School' }] })
  schools: mongoose.Types.ObjectId[] | School[] | string[];
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
