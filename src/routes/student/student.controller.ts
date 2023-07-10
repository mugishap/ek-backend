import {
  ErrorResponse,
  ResponseWithResults,
  NoTokenResponse,
} from '../../config/global.interface';
import {
  AddStudentBody,
  EditStudentBody,
  AddRecordBody,
  UpdateMarkBody,
  GetRecordsResponse,
  DeleteRecordBody,
  AddParentBody,
} from './student.types';
import { StudentService } from './student.service';
import { Jwt } from './../../config/global.interface';
import { OnlyAdminGuard, OnlyEducatorGuard } from './../../guards/admin.guard';
import {
  ClassSerializerInterceptor,
  Get,
  Post,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
  Delete,
  Body,
} from '@nestjs/common';
import {
  DefaultApiResponses,
  JWTToken,
  ProtectedController,
} from '../../custom/custom.decorators';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('student')
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiResponse({
  status: 401,
  description: 'UnAuthorized',
  type: NoTokenResponse,
})
@ProtectedController('jwt', 'student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  /**
   * Fetch all students in a specified class and year/grade in the school of the currently logged in user
   * @param token object that contains info about the request source
   * @param year
   * @param _class
   */
  @Get('/getAll')
  @UseGuards(OnlyAdminGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({
    description: 'Successfully retrieved all the students',
    type: ResponseWithResults,
  })
  @ApiResponse({
    status: 400,
    description: 'Something went wrong. Please try again.',
    type: ErrorResponse,
  })
  getAllStudents(@JWTToken() token: Jwt) {
    return this.studentService.getStudentsByAny(token.schoolId, {});
  }

  @Get('/getAllByClass')
  @UseGuards(OnlyAdminGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({
    description: 'Successfully retrieved the students',
    type: ResponseWithResults,
  })
  @ApiResponse({
    status: 400,
    description: 'Something went wrong. Please try again.',
    type: ErrorResponse,
  })
  getStudentsByClass(
    @JWTToken() token: Jwt,
    @Query('year', ParseIntPipe) year: number,
    @Query('class') _class: string,
  ) {
    console.log(year, _class);
    return this.studentService.getStudentsByClass(token.schoolId, year, _class);
  }

  @Post('/add')
  @UseGuards(OnlyAdminGuard)
  @DefaultApiResponses(
    'Successfully Added The Students',
    'Failed to add the students',
  )
  addStudents(@JWTToken() token: Jwt, @Body() body: AddStudentBody) {
    return this.studentService.addStudents(token.schoolId, body.students);
  }

  @Post('/edit')
  @UseGuards(OnlyAdminGuard)
  @DefaultApiResponses()
  editStudents(@JWTToken() token: Jwt, @Body() body: EditStudentBody) {
    return this.studentService.editStudent(
      token.schoolId,
      body.studentId,
      body.updates,
    );
  }

  @Post('/addRecord')
  @UseGuards(OnlyAdminGuard)
  @DefaultApiResponses()
  newRecord(@JWTToken() token: Jwt, @Body() body: AddRecordBody) {
    return this.studentService.newRecord(token.schoolId, body);
  }

  @Post('/updateMark')
  @UseGuards(OnlyAdminGuard)
  @DefaultApiResponses()
  updateMark(@JWTToken() token: Jwt, @Body() body: UpdateMarkBody) {
    return this.studentService.updateMark(token.schoolId, body);
  }

  @Post('/getRecords')
  @UseGuards(OnlyAdminGuard)
  @ApiOkResponse({ description: 'Successful', type: GetRecordsResponse })
  getRecords(
    @JWTToken() token: Jwt,
    @Query('_class') _class: string,
    @Query('_year') _year: string,
  ) {
    return this.studentService.getRecords(token.schoolId, _year, _class);
  }

  @Delete('/deleteRecord')
  @UseGuards(OnlyAdminGuard)
  @DefaultApiResponses('Successfully Deleted Record', 'Failed to delete record')
  deleteRecord(@JWTToken() token: Jwt, @Body() body: DeleteRecordBody) {
    return this.studentService.deleteRecord(token.schoolId, body._id);
  }

  @Post('/addParent')
  @UseGuards(OnlyAdminGuard)
  @DefaultApiResponses()
  addParent(@JWTToken() token: Jwt, @Body() body: AddParentBody) {
    return this.studentService.addParent(
      token.schoolId,
      body.studentId,
      body.parent_email,
    );
  }

  @Get('/getSummary')
  @UseGuards(OnlyEducatorGuard)
  @ApiOperation({
    summary: 'Get a summary of all the lessons a certain teacher teaches',
    description: 'This route is only accessible when logged in as an educator',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved summary',
    type: ResponseWithResults,
  })
  @ApiResponse({
    status: 400,
    description: 'Something went wrong',
    type: ErrorResponse,
  })
  getSummary(@JWTToken() token: Jwt) {
    return this.studentService.getSummary(token.schoolId, token.id);
  }
}
