import {
  AcademicLevel,
  AcademicLevelDocument,
} from './../../schemas/academicLevel.schema';
import { ParentService } from './../parent/parent.service';
import {
  StudentBody,
  LessStudentBody,
  AddRecordBody,
  UpdateMarkBody,
} from './student.types';
import { arr_to_obj, deep_stringify, green } from './../../config/oneliners';
import {
  Student,
  StudentDocument,
  SafeStudent,
} from './../../schemas/student.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types as MongoTypes } from 'mongoose';
import { Parent, ParentDocument } from '../../schemas/parent.schema';
import { EducatorService } from '../educator/educator.service';
import { Subject } from '../../schemas/subject.schema';
import { ResponseWithResults } from 'src/config/global.interface';
import { ErrorChecker } from '../../custom/custom.decorators';
import { SafeUser } from '../auth/auth.types';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
    @InjectModel(Parent.name)
    private readonly parentModel: Model<ParentDocument>,
    @InjectModel(AcademicLevel.name)
    private readonly academicLevelModel: Model<AcademicLevelDocument>,
    private readonly parentService: ParentService,
    private readonly educatorService: EducatorService,
  ) {}

  async getStudentsByClass(
    schoolId: string,
    year: number,
    _class: string,
  ): Promise<ResponseWithResults> {
    const students = await this.studentModel
      .find({
        school: new MongoTypes.ObjectId(schoolId),
        $and: [
          { 'class._class': new RegExp(`${_class}`, 'i') },
          { 'class._year': Number(year) },
        ],
      })
      .lean({ options: { _id: true } })
      .populate({ path: 'school', select: ['name', 'initials'] });

    const safeStudents: SafeUser<Student>[] = students.map(
      (student) => new SafeUser<Student>(deep_stringify(student), 'records'),
    );
    return {
      code: '#Success',
      results: deep_stringify(safeStudents),
    };
  }

  async getStudentsByAny(schoolId: string, options: Partial<Student> | object) {
    console.log(green(schoolId, options));
    const students = await this.studentModel
      .find({
        school: new MongoTypes.ObjectId(schoolId),
        ...options,
      })
      .lean();
    console.log(students);
    return deep_stringify(students);
  }

  @ErrorChecker()
  async addStudents(schoolId: string, students: StudentBody[]) {
    students = students?.map((student) => ({
      ...student,
      school: new MongoTypes.ObjectId(schoolId),
    }));

    console.log(students.length);
    console.log(
      await this.studentModel.insertMany(students, { ordered: false }),
    );
    return { code: '#Success' };
  }

  @ErrorChecker()
  async editStudent(
    schoolId: string,
    studentId: string,
    updates: LessStudentBody,
  ) {
    updates.parentEmails = updates.parentEmails?.slice(0, 2);
    const found = !!(await this.studentModel.findOneAndUpdate(
      {
        school: schoolId,
        _id: studentId,
      },
      {
        ...updates,
      },
    ));

    return found
      ? { code: '#Success' }
      : {
          code: '#Error',
          message: 'Something went wrong. Please check your information',
        };
  }

  @ErrorChecker()
  async newRecord(schoolId: string, recordInfo: AddRecordBody) {
    await this.studentModel.updateMany(
      {
        school: schoolId,
        'class._class': recordInfo._class,
        'class._year': recordInfo._year,
      },
      {
        $push: {
          records: {
            name: recordInfo.name,
            subject: recordInfo.subject,
            max: recordInfo.max,
            reversed: recordInfo.reversed,
            date: recordInfo.date,
            term: recordInfo.term,
          },
        },
      },
    );
  }

  @ErrorChecker()
  async updateMark(schoolId: string, recordInfo: UpdateMarkBody) {
    await this.studentModel.updateOne(
      {
        school: schoolId,
        _id: recordInfo.studentId,
        records: { $elemMatch: { _id: recordInfo.recordId } },
      },
      {
        $set: { 'records.$.mark': recordInfo.mark },
      },
    );
    return { code: '#Success' };
  }

  @ErrorChecker()
  async getRecords(schoolId: string, _year: string, _class: string) {
    const records = await this.studentModel
      .find({
        school: schoolId,
        'class._class': _class,
        'class._year': _year,
      })
      .lean()
      .populate({ path: 'subject', select: 'title' });
    return { code: '#Success', results: deep_stringify(records) };
  }

  @ErrorChecker()
  async deleteRecord(schoolId: string, recordId: string) {
    await this.studentModel.updateMany(
      {
        school: schoolId,
        records: { $elemMatch: { _id: recordId } },
      },
      {
        $pull: { records: { _id: recordId } },
      },
    );
    return { code: '#Success' };
  }

  async addParent(schoolId: string, studentId: string, parent_email: string) {
    const student = await this.studentModel.findOne({ _id: studentId });
    if (student.parentEmails.length == 2)
      return { code: '#Error', message: 'Only 2 parents allowed' };

    const parent = await this.parentModel.findOne({
      email: parent_email,
    });
    if (!!parent) {
      console.log('Adding child');
      return this.parentService.addChild(
        schoolId,
        parent._id,
        studentId,
        parent_email,
      );
    }

    console.log('Adding parent');
    return this.parentService.newParent(schoolId, studentId, parent_email);
  }

  async getClassesBySubjects(schoolId: string, subjects: Subject[]) {
    const subjectIds = subjects.map((subject: any) => subject._id);

    const levels = await this.academicLevelModel
      .find({
        school: schoolId,
        subjects: {
          $elemMatch: { $in: subjectIds },
        },
      })
      .lean();
    return deep_stringify(levels);
  }

  @ErrorChecker()
  async getSummary(schoolId: string, educatorId: string) {
    const educator_subjects = await this.educatorService.getSubjects(
      schoolId,
      educatorId,
    );
    if (educator_subjects.code === '#Error') {
      throw new Error(educator_subjects.message as string);
    }

    /* Filter for only the subjects taught at the current school */
    const subjects: Subject[] = (
      educator_subjects.results as Subject[]
    )?.filter((subject) => (subject.schools as string[]).includes(schoolId));
    /* Check for the classes that have those lessons */
    const levels = (await this.getClassesBySubjects(schoolId, subjects)).map(
      (level) => [level.year, level.classes],
    );

    const studentInfo: Student[] = await this.getStudentsByAny(schoolId, {
      'class._year': { $in: levels.map((level) => level[0]) },
    });
    const organizedStudents: object = arr_to_obj(levels, []);

    studentInfo.map((student) => {
      organizedStudents[student.class._year][student.class._class].push(
        new SafeStudent(
          student,
          'password',
          'email',
          'parentEmails',
          'profileLink',
        ),
      );
    });

    return { code: '#Success', results: deep_stringify(organizedStudents) };
  }
}
