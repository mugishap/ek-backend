import { yellow, checkEmoji } from './../config/oneliners';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

export interface CustomResponse extends Response {
  code?: string;
}

export interface ErrorMessage {
  message: string;
  specifier?: RegExp;
}

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  errorMessageMap = new Map<string, ErrorMessage>([
    [
      'dup key',
      { message: 'Duplicate Entry', specifier: /{\s(?:.*){2,}:\s"(.*)"/ },
    ],
  ]);

  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(yellow(checkEmoji, 'INTERCEPTING...'));

    const context = host.switchToHttp();
    const response = context.getResponse<CustomResponse>();
    const exceptionResponse: any = exception.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      code:
        (exceptionResponse ? exceptionResponse.code : undefined) || '#Error',
      message:
        (exceptionResponse
          ? this.errorMessageFilter(exceptionResponse)
          : undefined) || 'Something went wrong. Please try again.',
    });
  }

  errorMessageFilter(message: string): string {
    for (const message_key of this.errorMessageMap.keys()) {
      if (message.toString().includes(message_key)) {
        let addToMessage = '';
        if (this.errorMessageMap.get(message_key).specifier) {
          addToMessage =
            ':' +
            message.match(this.errorMessageMap.get(message_key).specifier)[1];
        }
        return this.errorMessageMap.get(message_key).message + addToMessage;
      }
    }
    return message;
  }
}
