import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StudentSchemaProvider,
  SchoolSchemaProvider,
  ParentSchemaProvider,
  EducatorSchemaProvider,
} from '../../schemas/schemas';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      StudentSchemaProvider,
      SchoolSchemaProvider,
      ParentSchemaProvider,
      EducatorSchemaProvider,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
