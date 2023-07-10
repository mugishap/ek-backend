import { AnnouncementBody } from './announcement.types';
import {
  AccountType,
  ResponseWithResults,
  ErrorResponse,
  SuccessResponse,
} from './../../config/global.interface';
import {
  Announcement,
  AnnouncementDocument,
} from './../../schemas/announcement.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ErrorChecker } from '../../custom/custom.decorators';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectModel(Announcement.name)
    private readonly announcementModel: Model<AnnouncementDocument>,
  ) {
    // this.temporal();
  }

  @ErrorChecker()
  async getAllAnnouncements(
    schoolId: string,
    accountType: AccountType,
    relevant = true,
  ): Promise<ResponseWithResults | ErrorResponse> {
    const allAnnouncements = await this.announcementModel
      .find({
        school: schoolId,
        meantFor: accountType === 'admin' ? void 0 : accountType,
      })
      .lean();

    return { code: '#Success', results: allAnnouncements };
  }

  @ErrorChecker()
  async createAnnouncement(
    schoolId: string,
    educatorId: string,
    data: AnnouncementBody,
  ): Promise<SuccessResponse | ErrorResponse> {
    const announcement = new this.announcementModel({
      composer: educatorId,
      school: schoolId,
      ...data,
    });

    await announcement.save();

    return { code: '#Success' };
  }
}
