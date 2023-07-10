import { AcademicYear } from './../../schemas/academicYear.schema';
import { SchoolTerm } from './../../schemas/term.schema';
import { Student } from './../../schemas/student.schema';
import { PartialType, OmitType, PickType } from '@nestjs/swagger';
import { Educator } from '../../schemas/educator.schema';
import { Parent } from '../../schemas/parent.schema';
import { UploadedFile } from '@nestjs/common';

export class UpdatableStudent extends PartialType(
  PickType(Student, ['parentEmails', 'email', 'profileLink']),
) {}

export class UpdatableEducator extends PartialType(
  PickType(Educator, ['email', 'profileLink', 'tel']),
) {}

export class UpdatableParent extends PartialType(
  PickType(Parent, ['email', 'profileLink', 'tel']),
) {}

export class TermBody extends PartialType(OmitType(SchoolTerm, ['current'])) {}

export class AcademicYearBody extends PartialType(
  OmitType(AcademicYear, ['current']),
) {}

// export class UpdateProfileBody {
//   @UploadedFile('file')
//   file: string;
// }
