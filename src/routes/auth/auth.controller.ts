import { ResponseWithResults } from './../../config/global.interface';
import { SignupBody } from './signupBody.dto';
import { ErrorResponse, SuccessResponse } from '../../config/global.interface';
import { DefaultAuthResponse } from './auth.types';
import { LoginBody } from './loginBody.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefaultApiResponses } from '../../custom/custom.decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UsePipes(ValidationPipe)
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Something went wrong.',
    type: ErrorResponse,
  })
  async login(
    @Body() { accountType, emailorcode, password, school }: LoginBody,
    @Res() res: Response,
  ): Promise<Response> {
    const result: DefaultAuthResponse = await this.authService.login(
      accountType,
      emailorcode,
      password,
      school,
    );
    if (result.code !== '#Success')
      return res.status(400).json({
        ...result,
        token: undefined,
        id: undefined,
      });

    res.cookie('jwt', result.token, {
      maxAge: 2 * 60 * 60 * 1000,
      sameSite: 'none',
    });
    return res.status(200).json({ ...result, token: undefined, id: undefined });
  }

  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('profile'))
  @Post('/signup')
  @UsePipes(ValidationPipe)
  @DefaultApiResponses('Successfully Registered School')
  async signup(@Body() body: SignupBody) {
    const result = await this.authService.signupSchool(body);
    return result;
  }

  @Get('/logout')
  @ApiOkResponse({
    description: 'Successfully logged out',
    type: SuccessResponse,
  })
  logout(@Res() res: Response) {
    res.cookie('jwt', 'none', { maxAge: 1 });
    res
      .status(200)
      .json({ code: '#Success', message: 'Successfully logged out' });
  }

  @Get('/schoolcodes')
  @DefaultApiResponses('Got the schools', 'Failed to fetch school codes')
  @ApiOkResponse({
    type: ResponseWithResults,
  })
  getSchoolCodes() {
    return this.authService.getSchoolCodes();
  }

  // @Get('/testdec')
  // testdec() {
  //   return { code: '#SuccessfulTest' };
  // }
}
