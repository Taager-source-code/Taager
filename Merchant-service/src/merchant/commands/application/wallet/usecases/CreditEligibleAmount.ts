import TransactionRequest from '../models/TransactionRequest';
import { Service } from 'typedi';
import { WalletNotFoundError } from '../../withdrawals/exceptions/WithdrawalsExceptions';
import { findUserWallet, findUserWalletByIdAndUpdate } from '../../usecases/userWallet.service';
import { TransactionManager } from '../../../../../shared-kernel/infrastructure/transactions/TransactionManager';

@Service({ global: true })
export default class CreditEligibleAmount {
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

      const wallet = UserWallet[0];
      await findUserWalletByIdAndUpdate({
        id: wallet._id,
        update: {
          $set: {
            eligibleProfit: wallet.eligibleProfit + request.amount,
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


