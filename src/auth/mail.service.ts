import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  public transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'فعال سازی حساب برای ' + process.env.API_URL,
      text: '',
      html: `
                    <div>
                        <h1>برای فعال سازی لینک را دنبال کنید</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
    });
  }
}
