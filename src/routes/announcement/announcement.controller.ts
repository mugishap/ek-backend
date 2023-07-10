import { AnnouncementBody } from './announcement.types';
import { OnlyEducatorGuard } from './../../guards/admin.guard';
import {
  Jwt,
  ResponseWithResults,
  ErrorResponse,
  SuccessResponse,
  NoTokenResponse,
} from './../../config/global.interface';
import { AnnouncementService } from './announcement.service';
import { Body, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWTToken, ProtectedController } from '../../custom/custom.decorators';

@ProtectedController('jwt', 'announcement')
@ApiTags('announcement')
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiResponse({
  status: 401,
  description: 'UnAuthorized',
  type: NoTokenResponse,
})
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get('/getAll')
  @ApiOkResponse({
    description: 'Successfully got all announcements',
    type: ResponseWithResults,
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to get announcements',
    type: ErrorResponse,
  })
  getAllAnnouncements(@JWTToken() token: Jwt) {
    return this.announcementService.getAllAnnouncements(
      token.schoolId,
      token.accountType,
    );
  }

  @Post('/new')
  @UseGuards(OnlyEducatorGuard)
  newAnnouncement(
    @JWTToken() token: Jwt,
    @Body() body: AnnouncementBody,
  ): Promise<SuccessResponse | ErrorResponse> {
    return this.announcementService.createAnnouncement(
      token.schoolId,
      token.id,
      body,
    );
  }
}
