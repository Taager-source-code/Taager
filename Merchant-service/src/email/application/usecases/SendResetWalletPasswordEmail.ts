import ResetPasswordRequest from '../models/ResetPasswordRequest';
import { sendMail } from '../../infrastructure/email.service';
import Env from '../../../Env';
import { Service } from 'typedi';

@Service({ global: true })
export default class SendResetPasswordEmail {
  async execute(request: ResetPasswordRequest) {
    await sendMail(
      request.email,
      'Password Reset',
      'forgot-password.ejs',
      Object.assign(request, {
        link: `${Env.FRONTEND_URI}/reset-password/${request.userId}/${request.resetPasswordToken}`,
      }),
    );
  }
}


