import { OnlyAdminGuard } from './../../guards/admin.guard';
import { TermBody } from './settings.types';
import {
  Jwt,
  SomeUserSchema,
  ResponseWithResults,
  ErrorResponse,
  NoTokenResponse,
} from './../../config/global.interface';
import { SettingsService } from './settings.service';
import {
  Post,
  Get,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  DefaultApiResponses,
  JWTToken,
  ProtectedController,
} from '../../custom/custom.decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@ProtectedController('jwt', 'settings')
@ApiTags('settings')
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiResponse({
  status: 401,
  description: 'UnAuthorized',
  type: NoTokenResponse,
})
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('/update')
  @DefaultApiResponses('Successfully updated', 'Failed to update')
  update(@JWTToken() token: Jwt, @Body() body: Partial<SomeUserSchema>) {
    return this.settingsService.updateInfo(token.id, token.accountType, body);
  }

  @Post('/newTerm')
  @UseGuards(OnlyAdminGuard)
  @DefaultApiResponses(
    'Successfully created new term',
    'Failed to create new term',
  )
  newTerm(@JWTToken() token: Jwt, @Body() body: TermBody) {
    return this.settingsService.createTerm(token.schoolId, body);
  }

  @Get('/terms')
  @ApiOkResponse({ description: 'Got the terms', type: ResponseWithResults })
  @ApiResponse({
    status: 400,
    description: 'Something went wrong. Please try again.',
    type: ErrorResponse,
  })
  getTerms(@JWTToken() token: Jwt) {
    return this.settingsService.getRecentTerms(token.schoolId);
  }

  @Post('/updateProfile')
  @DefaultApiResponses(
    'Successfully updated profile',
    'Failed to update profile',
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  updateProfile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { code: '#Success', message: 'Shit and Stuff' };
  }
}
