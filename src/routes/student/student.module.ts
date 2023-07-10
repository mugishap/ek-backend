import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AcademicLevelSchemaProvider,
  EducatorSchemaProvider,
  ParentSchemaProvider,
  StudentSchemaProvider,
  SubjectSchemaProvider,
} from '../../schemas/schemas';
import { EducatorService } from './../educator/educator.service';
import { ParentService } from './../parent/parent.service';
import { SendGridService } from './../sendgrid/sendgrid.service';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      StudentSchemaProvider,
      ParentSchemaProvider,
      EducatorSchemaProvider,
      AcademicLevelSchemaProvider,
      SubjectSchemaProvider,
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService, SendGridService, ParentService, EducatorService],
})
export class StudentModule {}
