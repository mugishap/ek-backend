import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import mongoose from 'mongoose';
import { School } from './school.schema';
import { ApiProperty } from '@nestjs/swagger';

export type AcademicYearDocument = AcademicYear & Document;

@Schema({ strict: true })
export class AcademicYear {
  @Prop()
  @ApiProperty({})
  start: Date;

  @Prop()
  @ApiProperty({})
  end: Date;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: 'School' })
  @ApiProperty({ description: 'school _id' })
  school: mongoose.Types.ObjectId | School;

  @Prop({ default: true })
  @ApiProperty({})
  current: boolean;
}

export const AcademicYearSchema = SchemaFactory.createForClass(AcademicYear);
