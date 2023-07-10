import {
  ResponseWithResults,
  ErrorResponse,
  NoTokenResponse,
  Jwt,
} from './../../config/global.interface';
import { GetParentInfoBody, RegisterParentBody } from './parent.types';
import { NoStudentGuard, OnlyParentGuard } from './../../guards/admin.guard';
import { ParentService } from './parent.service';
import { Body, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  DefaultApiResponses,
  JWTToken,
  ProtectedController,
} from '../../custom/custom.decorators';

@ProtectedController('jwt', 'parent')
@ApiTags('parent')
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiResponse({
  status: 401,
  description: 'UnAuthorized',
  type: NoTokenResponse,
})
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post('/getInfo')
  @UseGuards(NoStudentGuard)
  @ApiOkResponse({ type: ResponseWithResults, description: 'Got Parent Info' })
  @ApiResponse({
    status: 400,
    description: 'Failed to get parent info',
    type: ErrorResponse,
  })
  async getParentInfo(
    @Body() { parentId }: GetParentInfoBody,
  ): Promise<ResponseWithResults | ErrorResponse> {
    return this.parentService.getParentInfo(parentId);
  }

  @Post('/register/:id')
  @DefaultApiResponses(
    'Successfully registered parent',
    'Failed to Register Parent',
  )
  registerParent(
    @Param('id') parentId: string,
    @Body() { updates }: RegisterParentBody,
  ) {
    return this.parentService.registerParent(parentId, updates);
  }

  @Get('/getChildrenInfo')
  @ApiOkResponse({
    type: ResponseWithResults,
    description: 'Got Children Info i.e Records, ...',
  })
  @ApiResponse({
    status: 400,
    type: ErrorResponse,
    description: 'Something went wrong. Please try again',
  })
  @UseGuards(OnlyParentGuard)
  getChildrenInfo(@JWTToken() token: Jwt) {
    return this.parentService.getChildrenInfo(token.id);
  }
}
