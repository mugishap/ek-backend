import { CorsMW } from './middleware/cors.middleware';
import { ParentModule } from './routes/parent/parent.module';
import { SettingsModule } from './routes/settings/settings.module';
import { AnnouncementModule } from './routes/announcement/announcement.module';
import { EducatorModule } from './routes/educator/educator.module';
import { AppController } from './app.controller';
import { infoEmoji } from './config/oneliners';
import { AdminModule } from './routes/admin/admin.module';
import {
  CookieCheckMW,
  RemoveCookiesMW,
} from './middleware/cookies.middleware';
import { AuthModule } from './routes/auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './routes/student/student.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require('chalk');

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.DB_CONN_STR),
    AuthModule,
    AdminModule,
    StudentModule,
    EducatorModule,
    ParentModule,
    AnnouncementModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMW).forRoutes('*');
    consumer.apply(CookieCheckMW).exclude('auth(.*)').forRoutes('*');
    consumer.apply(RemoveCookiesMW).forRoutes('auth/(.*)');
  }
  constructor() {
    console.log(chalk.yellow(infoEmoji, 'Starting up...'));
  }
}
