import ejs from 'ejs';
import path from 'path';
import transport from './nodemailer';
import Env from '../../Env';

const renderHtmlTemplate = (templatePath, data) =>
  new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, data, (err, html) => {
      if (err) {
        return reject(err);
      }
      resolve(html);
    });
  });

export const sendMail = async (to, subject, templateName, data) => {
  const html = await renderHtmlTemplate(path.resolve('src/email/infrastructure/email-templates', templateName), data);
  await transport.sendMail({
    from: Env.MAILER_SENDER,
    to,
    subject,
    html,
  });
};


