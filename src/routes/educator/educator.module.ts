import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AcademicLevelSchemaProvider,
  EducatorSchemaProvider,
  SubjectSchemaProvider,
} from '../../schemas/schemas';
import { EducatorController } from './educator.controller';
import { EducatorService } from './educator.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      EducatorSchemaProvider,
      SubjectSchemaProvider,
      AcademicLevelSchemaProvider,
    ]),
  ],
  controllers: [EducatorController],
  providers: [EducatorService],
})
export class EducatorModule {}
