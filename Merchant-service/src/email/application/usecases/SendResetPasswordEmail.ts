import ResetWalletPasswordRequest from '../models/ResetWalletPasswordRequest';
import { sendMail } from '../../infrastructure/email.service';
import Env from '../../../Env';
import { Service } from 'typedi';

@Service({ global: true })
export default class SendResetWalletPasswordEmail {
  async execute(request: ResetWalletPasswordRequest) {
    await sendMail(
      request.email,
      'Wallet Password Reset',
      'forgot-wallet-password.ejs',
      Object.assign(request, {
        link: `${Env.FRONTEND_URI}/reset-wallet-password/${request.userId}/${request.resetWalletPasswordToken}`,
      }),
    );
  }
}


