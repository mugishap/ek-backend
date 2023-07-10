import {
  Jwt,
  ResponseWithResults,
  ErrorResponse,
  NoTokenResponse,
} from './../../config/global.interface';
import { EducatorService } from './educator.service';
import { OnlyAdminGuard } from './../../guards/admin.guard';
import { Body, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  DefaultApiResponses,
  JWTToken,
  ProtectedController,
} from '../../custom/custom.decorators';
import { AddEducatorBody, EditEducatorBody } from './educator.types';

@ProtectedController('jwt', 'educator')
@ApiTags('educator')
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiResponse({
  status: 401,
  description: 'UnAuthorized',
  type: NoTokenResponse,
})
export class EducatorController {
  constructor(private readonly educatorService: EducatorService) {}

  @Post('/add')
  @DefaultApiResponses()
  @UseGuards(OnlyAdminGuard)
  addEducator(@JWTToken() token: Jwt, @Body() body: AddEducatorBody) {
    return this.educatorService.addEducator(token.schoolId, body);
  }

  @Get('/getAll')
  @ApiOkResponse({
    description: 'Successfully retrieved educator',
    type: ResponseWithResults,
  })
  @ApiResponse({
    status: 400,
    description: 'Something went wrong',
    type: ErrorResponse,
  })
  @UseGuards(OnlyAdminGuard)
  getAllEducators(@JWTToken() token: Jwt) {
    return this.educatorService.getAllEducators(token.schoolId);
  }

  @Post('/edit')
  @DefaultApiResponses()
  @UseGuards(OnlyAdminGuard)
  editEducator(
    @JWTToken() token: Jwt,
    @Body() { educatorId, updates }: EditEducatorBody,
  ) {
    return this.educatorService.editEducator(
      token.schoolId,
      educatorId,
      updates,
    );
  }
}
