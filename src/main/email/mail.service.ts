import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(
    email: string,
    subject: string,
    template: string,
    context: object,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      template: template,
      context: {
        ...context,
      },
    });
  }

  async sendMailToAdmin(subject: string, template: string, context: object) {
    await this.mailerService.sendMail({
      subject: subject,
      template: template,
      context: {
        ...context,
      },
    });
  }

  async sendMailWithCarbonCopy(
    cc: string[],
    subject: string,
    template: string,
    context: object,
  ) {
    await this.mailerService.sendMail({
      cc: cc,
      subject: subject,
      template: template,
      context: {
        ...context,
      },
    });
  }
}
