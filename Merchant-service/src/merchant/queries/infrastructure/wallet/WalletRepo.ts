import { Service } from 'typedi';
import Wallet from '../../application/wallet/models/Wallet';
import WalletDao from '../../../common/infrastructure/db/access/WalletDao';
import WalletConverter from './WalletConverter';

@Service({ global: true })
export default class WalletRepo {
  private walletDao: WalletDao;

  constructor(walletDao: WalletDao) {
    this.walletDao = walletDao;
  }

  async list(userId: string, currency?: string): Promise<Wallet[]> {
    const options: any = { userID: userId };
    if (currency) options.currency = currency;
    const wallets = await this.walletDao.findUserWallet(options);
    return wallets.map(request => WalletConverter.toApplication(request));
  }
}


