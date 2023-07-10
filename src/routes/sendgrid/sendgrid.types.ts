export class Mail {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  dynamicTemplateData?: object;
}

export class ChangeMarkMailContent {
  student_names: string;
  subject: string;
  marks: number;
  reason?: string;
  educator_email: string;
  action: 'lost' | 'gained';
  date: string;
}

export class NewParentMailContent {
  student_names: string;
  code: string;
  date: string;
}

export class ChangeMarkMail extends Mail {
  dynamicTemplateData: ChangeMarkMailContent;
}

export class NewParentMail extends Mail {
  dynamicTemplateData: NewParentMailContent;
}

export class Template {
  name: string;
  templateId: string;
}
