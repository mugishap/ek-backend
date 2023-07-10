import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EducatorSchemaProvider,
  ParentSchemaProvider,
  SchoolSchemaProvider,
  SchoolTermSchemaProvider,
  StudentSchemaProvider,
} from '../../schemas/schemas';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      StudentSchemaProvider,
      EducatorSchemaProvider,
      ParentSchemaProvider,
      SchoolTermSchemaProvider,
      SchoolSchemaProvider,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
