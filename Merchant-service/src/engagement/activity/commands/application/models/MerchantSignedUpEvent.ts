import { Merchant } from './Merchant';

export type MerchantSignedUpEvent = {
  merchant: Merchant;
  signUpSource: SignUpSource;
};

export enum SignUpSource {
  Normal = 'NORMAL',
  Social = 'SOCIAL',
}


