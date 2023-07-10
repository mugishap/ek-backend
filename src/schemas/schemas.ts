import { Subject } from 'rxjs';
import { AcademicLevel, AcademicLevelSchema } from './academicLevel.schema';
import { AcademicYear, AcademicYearSchema } from './academicYear.schema';
import { Announcement, AnnouncementSchema } from './announcement.schema';
import { Educator, EducatorSchema } from './educator.schema';
import { Parent, ParentSchema } from './parent.schema';
import { School, SchoolSchema } from './school.schema';
import { Student, StudentSchema } from './student.schema';
import { SubjectSchema } from './subject.schema';
import { SchoolTerm, SchoolTermSchema } from './term.schema';

export const StudentSchemaProvider = {
  name: Student.name,
  schema: StudentSchema,
};

export const ParentSchemaProvider = { name: Parent.name, schema: ParentSchema };

export const EducatorSchemaProvider = {
  name: Educator.name,
  schema: EducatorSchema,
};

export const AcademicLevelSchemaProvider = {
  name: AcademicLevel.name,
  schema: AcademicLevelSchema,
};

export const SubjectSchemaProvider = {
  name: Subject.name,
  schema: SubjectSchema,
};

export const AcademicYearSchemaProvider = {
  name: AcademicYear.name,
  schema: AcademicYearSchema,
};

export const AnnouncementSchemaProvider = {
  name: Announcement.name,
  schema: AnnouncementSchema,
};

export const SchoolSchemaProvider = { name: School.name, schema: SchoolSchema };

export const SchoolTermSchemaProvider = {
  name: SchoolTerm.name,
  schema: SchoolTermSchema,
};
