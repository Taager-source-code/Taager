import nodemailer from 'nodemailer';
import { htmlToText } from 'nodemailer-html-to-text';
import Env from '../../Env';

const transport = nodemailer.createTransport({
  host: Env.MAILER_HOST, // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: Env.MAILER_PORT, // port for secure SMTP,
  auth: {
    user: Env.MAILER_SENDER,
    pass: Env.MAILER_PASS,
  },
});
transport.use('compile', htmlToText());

export default transport;


