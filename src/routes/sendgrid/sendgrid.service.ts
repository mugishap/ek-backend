import { Mail } from './sendgrid.types';
import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  private readonly templates = [
    {
      name: 'change_marks',
      templateId: 'd-641cd9d8838f4289b30f0a34a51d8bab',
    },
    {
      name: 'register_parent',
      templateId: 'd-37e0837edd554647b05eea0d40921c25',
    },
  ];
  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async send(mailInfo: Mail, templateName) {
    const template = this.templates.find((el) => el.name === templateName);
    if (!template) throw 'Invalid Template Name';
    const mail: SendGrid.MailDataRequired = {
      ...mailInfo,
      templateId: template.templateId,
      from: 'eKOSORA <ishimvainqueur@gmail.com>',
      // from: 'eKOSORA <noreply@ekosora.com>',
    };
    try {
      await SendGrid.send(mail);
    } catch (e) {
      console.log(e);
    }
  }
}
