import { Announcement } from './../../schemas/announcement.schema';
import { PartialType, OmitType } from '@nestjs/swagger';
export class AnnouncementBody extends PartialType(
  OmitType(Announcement, ['composer', 'date', 'school']),
) {}

// export class CreateAnnouncementBody {}
