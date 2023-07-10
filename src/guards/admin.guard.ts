import { yellow, checkEmoji } from './../config/oneliners';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class OnlyAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: any = context.switchToHttp().getRequest();
    console.log(yellow(checkEmoji, '[AdminGuard] '), 'Checking');
    if (!request.jwt?.isAdmin)
      throw new HttpException(
        'Only admins can access this route',
        HttpStatus.UNAUTHORIZED,
      );
    return !!request.jwt?.isAdmin;
  }
}

@Injectable()
export class OnlyEducatorGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: any = context.switchToHttp().getRequest();
    console.log(yellow(checkEmoji, '[EducatorGuard] '), 'Checking');
    return request.jwt?.accountType === 'educator';
  }
}

@Injectable()
export class NoStudentGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: any = context.switchToHttp().getRequest();
    console.log(yellow(checkEmoji, '[NoStudentGuard] '), 'Checking');
    return request.jwt?.accountType !== 'student';
  }
}

@Injectable()
export class OnlyParentGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: any = context.switchToHttp().getRequest();
    console.log(yellow(checkEmoji, '[OnlyParentGuard] '), 'Checking');
    return request.jwt?.accountType === 'parent';
  }
}
