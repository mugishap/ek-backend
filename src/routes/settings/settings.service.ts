import { CloudinaryService } from './../cloudinary/cloudinary.service';
import {
  AcademicYear,
  AcademicYearDocument,
} from './../../schemas/academicYear.schema';
import { TermBody, AcademicYearBody } from './settings.types';
import { Parent, ParentDocument } from './../../schemas/parent.schema';
import { Educator, EducatorDocument } from './../../schemas/educator.schema';
import { Student, StudentDocument } from './../../schemas/student.schema';
import {
  AccountType,
  ErrorResponse,
  SomeUserSchema,
  SuccessResponse,
} from './../../config/global.interface';
import { SchoolTerm, SchoolTermDocument } from './../../schemas/term.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { ErrorChecker } from '../../custom/custom.decorators';

@Injectable()
export class SettingsService {
  modelMap = new Map<string, Model<Document & any>>();

  constructor(
    @InjectModel(SchoolTerm.name)
    private readonly schoolTermModel: Model<SchoolTermDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
    @InjectModel(Educator.name)
    private readonly educatorModel: Model<EducatorDocument>,
    @InjectModel(Parent.name)
    private readonly parentModel: Model<ParentDocument>,
    @InjectModel(AcademicYear.name)
    private readonly academicYearModel: Model<AcademicYearDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    this.modelMap.set('student', this.studentModel);
    this.modelMap.set('educator', this.educatorModel);
    this.modelMap.set('admin', this.educatorModel);
    this.modelMap.set('parent', this.parentModel);
  }
  async getRecentTerms(schoolId: string) {
    const terms = await this.schoolTermModel
      .find({ school: schoolId })
      .sort({ start: 1 })
      .limit(3)
      .lean()
      .populate(['academicYear']);
    return { code: '#Success', result: terms };
  }

  async getCurrentTerm(schooldId: string) {
    const curTerm = await this.schoolTermModel
      .findOne({
        school: schooldId,
        current: true,
      })
      .lean()
      .populate('academicYear');
    return { code: '#Success', result: curTerm };
  }

  @ErrorChecker()
  async createTerm(schoolId: string, data: TermBody) {
    const term = new this.schoolTermModel({ ...data, school: schoolId });
    await term.save();

    await this.schoolTermModel.updateMany(
      { school: schoolId },
      { current: false },
    );

    return { code: '#Success' };
  }

  @ErrorChecker()
  async createAcademicYear(schoolId: string, data: AcademicYearBody) {
    const term = new this.academicYearModel({ ...data, school: schoolId });
    await term.save();

    await this.academicYearModel.updateMany(
      { school: schoolId },
      { current: false },
    );

    return { code: '#Success' };
  }

  @ErrorChecker()
  async updateInfo(
    _id: string,
    accountType: AccountType,
    updates: Partial<Omit<SomeUserSchema, 'profileLink'>>,
  ): Promise<SuccessResponse | ErrorResponse> {
    const update = await this.modelMap
      .get(accountType)
      ?.updateOne({ _id }, { ...updates });

    if (!update) throw new Error('Failed to update user info');

    return { code: '#Success' };
  }

  @ErrorChecker()
  async updateProfile(
    file: any,
    profileId: string,
    accountType: AccountType,
  ): Promise<SuccessResponse | ErrorResponse> {
    const res = await this.cloudinaryService.uploadFile(file, { folder: 'ek' });
    await this.modelMap
      .get(accountType)
      .updateOne({ _id: profileId }, { profileLink: res.secure_url });
    return { code: '#Success' };
  }
}
