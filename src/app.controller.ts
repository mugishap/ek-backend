import { Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ProtectedController } from './custom/custom.decorators';

@ProtectedController('jwt', '')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ description: 'Valid token' })
  check(): object {
    return {
      code: '#Authorized',
    };
  }
}
