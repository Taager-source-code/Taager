import { Service } from 'typedi';
import {
  InsufficientEligibleAmountError,
  WalletNotFoundError,
} from '../../withdrawals/exceptions/WithdrawalsExceptions';
import { findUserWallet, findUserWalletByIdAndUpdate } from '../../usecases/userWallet.service';
import TransactionRequest from '../models/TransactionRequest';
import { TransactionManager } from '../../../../../shared-kernel/infrastructure/transactions/TransactionManager';

@Service({ global: true })
export default class DebitEligibleAmount {
  private transactionManager: TransactionManager;

  constructor(transactionManager: TransactionManager) {
    this.transactionManager = transactionManager;
  }

  async execute(request: TransactionRequest) {
    await this.transactionManager.runTransactionally(async session => {
      const UserWallet = await findUserWallet(
        {
          userID: request.userId,
          currency: request.currency,
        },
        session,
      );
      if (!UserWallet || !UserWallet[0]) throw new WalletNotFoundError();

      if (request.amount > UserWallet[0].eligibleProfit) throw new InsufficientEligibleAmountError();

      const wallet = UserWallet[0];
      await findUserWalletByIdAndUpdate({
        id: wallet._id,
        update: {
          $set: {
            eligibleProfit: wallet.eligibleProfit - request.amount,
          },
        },
        options: {
          new: false,
          session,
        },
        lean: false,
      });
    });
  }
}


