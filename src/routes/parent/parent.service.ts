import {
  ResponseWithResults,
  ErrorResponse,
  SuccessResponse,
} from './../../config/global.interface';
import { deep_stringify } from './../../config/oneliners';
import { SafeParent } from './../../schemas/parent.schema';
import { SendGridService } from './../sendgrid/sendgrid.service';
import { Parent, ParentDocument } from '../../schemas/parent.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewParentMailContent } from '../sendgrid/sendgrid.types';
import { Student, StudentDocument } from '../../schemas/student.schema';
import { RegisterParent } from './parent.types';
import { ErrorChecker } from '../../custom/custom.decorators';

@Injectable()
export class ParentService {
  constructor(
    @InjectModel(Parent.name)
    private readonly parentModel: Model<ParentDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
    private readonly sendGridService: SendGridService,
  ) {}

  @ErrorChecker()
  async getParentInfo(
    parentId: string,
  ): Promise<ResponseWithResults | ErrorResponse> {
    const parent = await this.parentModel
      .findOne({ _id: parentId })
      .lean()
      .populate({ path: 'children', select: 'names code email' });

    const safeParent = new SafeParent(parent);

    return { code: '#Success', results: deep_stringify(safeParent) };
  }

  @ErrorChecker()
  async newParent(
    schoolId: string,
    studentId: string,
    parent_email: string,
  ): Promise<SuccessResponse | ErrorResponse> {
    const student = await this.studentModel.findOne({
      _id: studentId,
      school: schoolId,
    });

    if (!student) throw new Error('Invalid Student ID. Student Does Not Exist');
    if (student.parentEmails.length == 2)
      return { code: '#Error', message: 'Only 2 parents allowed' };

    await this.studentModel.updateOne(
      { _id: studentId },
      { $push: { parentEmails: parent_email } },
    );

    const parent = new this.parentModel({
      email: parent_email,
      children: [studentId],
    });
    await parent.save();

    const mailContent: NewParentMailContent = {
      code: String(parent._id),
      student_names: student.names,
      date: `${new Date().toString().slice(0, 21)}`,
    };
    await this.sendGridService.send(
      {
        subject: 'Welcome to eKOSORA',
        to: parent_email,
        dynamicTemplateData: mailContent,
      },
      'register_parent',
    );

    return { code: '#Success' };
  }

  @ErrorChecker()
  async registerParent(
    parentId: string,
    updates: RegisterParent,
  ): Promise<SuccessResponse | ErrorResponse> {
    const parent = await this.parentModel.findOneAndUpdate(
      { _id: parentId },
      { ...updates },
    );
    if (!parent) throw new Error('Parent Not Found');

    return { code: '#Success' };
  }

  @ErrorChecker()
  async addChild(
    schoolId: string,
    parentId: string,
    studentId: string,
    parent_email: string,
  ): Promise<SuccessResponse | ErrorResponse> {
    const child = await this.studentModel.findOne({
      school: schoolId,
      _id: studentId,
    });
    if (!child) {
      throw new Error('Invalid Student ID. Student Does Not Exist');
    }
    const student = await this.studentModel.findOne({ _id: studentId });
    if (student.parentEmails.length == 2)
      return { code: '#Error', message: 'Only 2 parents allowed' };

    await this.studentModel.updateOne(
      { _id: child._id },
      { $push: { parentEmails: parent_email } },
    );

    const parent = await this.parentModel.updateOne(
      { _id: parentId },
      { $push: { children: studentId } },
    );

    if (!parent.matchedCount) {
      throw new Error('Invalid Parent ID. Parent Does Not Exist');
    }

    return {
      code: '#Success',
    };
  }

  @ErrorChecker()
  async getChildrenInfo(
    parentId: string,
  ): Promise<ResponseWithResults | ErrorResponse> {
    // await this.studentModel
    return { code: '#Success', results: [] };
  }
}
