import { Inject, Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import got from 'got';

import { CONFIG_OPTIONS } from '../common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  sendVerificationEmail(userName: string, code: string): void {
    this.sendEmail(
      'Verify Your Email',
      'nuber-email-template',
      'tgrf07@naver.com',
      [
        { key: 'username', value: userName },
        { key: 'code', value: code },
      ],
    );
  }

  private async sendEmail(
    subject: string,
    template: string,
    to: string,
    emailVars: EmailVar[],
  ) {
    const form = new FormData();
    form.append('from', `Excited User <mailgun@${this.options.emailDomain}>`);
    form.append('subject', subject);
    form.append('template', template);
    form.append('to', to);
    emailVars.forEach((emailVars) =>
      form.append(`v:${emailVars.key}`, emailVars.value),
    );

    try {
      await got(
        `https://api.mailgun.net/v3/${this.options.emailDomain}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
}
