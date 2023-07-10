import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ParentSchemaProvider,
  StudentSchemaProvider,
} from '../../schemas/schemas';
import { SendGridService } from './../sendgrid/sendgrid.service';
import { ParentController } from './parent.controller';
import { ParentService } from './parent.service';

@Module({
  imports: [
    MongooseModule.forFeature([ParentSchemaProvider, StudentSchemaProvider]),
  ],
  controllers: [ParentController],
  providers: [ParentService, SendGridService],
})
export class ParentModule {}
