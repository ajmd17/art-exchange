import * as nodemailer from 'nodemailer';

import config from './config'

export default {
  _transport: nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.MAILER_ADDRESS,
      pass:  config.MAILER_PASSWORD
    }
  }),

  send(to, subject, html, cc=[]) {
    return this._transport.sendMail({
      to,
      subject,
      html,
      cc
    });
  }
};