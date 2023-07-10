import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
export class CorsMW implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', req.get('origin'));
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Set-Cookie');
    next();
  }
}
