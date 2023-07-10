import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { School } from './school.schema';
import { Subject } from './subject.schema';

export type AcademicLevelDocument = Document & AcademicLevel;

@Schema({ strict: true })
export class AcademicLevel {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School' })
  school: mongoose.Types.ObjectId | School;

  @Prop()
  year: number;

  @Prop()
  classes: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }] })
  subjects: mongoose.Types.ObjectId[] | Subject[];
}

export const AcademicLevelSchema = SchemaFactory.createForClass(AcademicLevel);
