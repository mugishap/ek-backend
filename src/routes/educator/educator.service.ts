import {
  AcademicLevel,
  AcademicLevelDocument,
} from './../../schemas/academicLevel.schema';
import { deep_stringify, removePassword } from './../../config/oneliners';
import { Subject, SubjectDocument } from './../../schemas/subject.schema';
import { ResponseWithResults } from './../../config/global.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Educator, EducatorDocument } from '../../schemas/educator.schema';
import { AddEducatorBody } from './educator.types';
import { ErrorChecker } from '../../custom/custom.decorators';

@Injectable()
export class EducatorService {
  constructor(
    @InjectModel(Educator.name)
    private readonly educatorModel: Model<EducatorDocument>,
    @InjectModel(Subject.name)
    private readonly subjectModel: Model<SubjectDocument>,
    @InjectModel(AcademicLevel.name)
    private readonly academicLevelModel: Model<AcademicLevelDocument>,
  ) {
    // this.temporal();
  }

  @ErrorChecker()
  async getSubjects(
    schoolId: string,
    educatorId: string,
  ): Promise<ResponseWithResults> {
    const educator = await this.educatorModel
      .findOne({
        _id: educatorId,
        school: schoolId,
      })
      .lean()
      .populate('subjects');

    if (!educator) {
      throw new Error('Invalid EducatorID. No Such Educator in The System');
    }

    return { code: '#Success', results: deep_stringify(educator.subjects) };
  }

  @ErrorChecker()
  async addEducator(schoolId: string, educatorInfo: AddEducatorBody) {
    const educator = new this.educatorModel({
      ...educatorInfo,
      password: process.env.DEFAULT_PASSWORD,
    });
    await educator.save();
    return { code: '#Success' };
  }

  @ErrorChecker()
  async getAllEducators(schoolId: string) {
    // TODO: Add the exec to remove password
    const educators = await this.educatorModel
      .find({ school: schoolId })
      .lean()
      .select('_id names code title email tel profileLink subjects school');
    console.log(educators);
    return { code: '#Success', results: deep_stringify(educators) };
  }

  @ErrorChecker()
  async editEducator(
    schoolId: string,
    educatorId: string,
    updates: Partial<Educator>,
  ) {
    await this.educatorModel.updateOne(
      { school: schoolId, _id: educatorId },
      { ...updates },
    );
    return { code: '#Success' };
  }

  // async temporal() {
  //   const allSubjects = await this.subjectModel.find({});
  //   const allLevels: any = deep_stringify(
  //     await this.academicLevelModel.find({}).lean(),
  //   );

  //   for (const level of allLevels) {
  //     let subjects = allSubjects.filter((subject) =>
  //       level.lessons?.includes(subject.code),
  //     );
  //     console.log(level.lessons);
  //     subjects = subjects.map((subject) => subject._id);
  //     await this.academicLevelModel.updateOne({ _id: level._id }, { subjects });
  //   }
  //   console.log('DONE');
  // }
}
