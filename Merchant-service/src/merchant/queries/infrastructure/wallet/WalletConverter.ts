import { UserWalletEntity } from '../../../common/infrastructure/db/models/UserWalletEntity';
import Wallet from '../../application/wallet/models/Wallet';

export default class WalletConverter {
  static toApplication(userWallet: UserWalletEntity): Wallet {
    return {
      expectedAmount: userWallet.inprogressProfit,
      eligibleAmount: userWallet.eligibleProfit,
      currency: userWallet.currency,
      ordersCountForExpectedAmount: userWallet.inprogressOrders,
    };
  }
}


