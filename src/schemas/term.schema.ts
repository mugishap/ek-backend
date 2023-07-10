import { AcademicYear } from './academicYear.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { School } from './school.schema';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SchoolTermDocument = SchoolTerm & Document;

@Schema({ strict: true })
export class SchoolTerm {
  @Prop()
  @ApiProperty({})
  start: Date;

  @Prop()
  @ApiProperty({})
  end: Date;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: 'School' })
  @ApiProperty({ description: 'school _id' })
  school: mongoose.Types.ObjectId | School;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: 'AcademicYear' })
  @ApiProperty({ description: 'academic year _id' })
  academicYear: mongoose.Types.ObjectId | AcademicYear;

  @Prop({ default: true })
  current: boolean;
}

export const SchoolTermSchema = SchemaFactory.createForClass(SchoolTerm);
