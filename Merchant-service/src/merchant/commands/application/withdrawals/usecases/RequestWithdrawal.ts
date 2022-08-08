import { Service } from 'typedi';
import WithdrawalRequest from '../models/WithdrawalRequest';
import Withdrawal from '../../../domain/withdrawals/Withdrawal';
import DebitEligibleAmount from '../../wallet/usecases/DebitEligibleAmount';
import WithdrawalRepo from '../../../infrastrcuture/withdrawals/repositories/WithdrawalRepo';
import { findUserWallet } from '../../usecases/userWallet.service';
import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';

@Service({ global: true })
export default class RequestWithdrawal {
  private withdrawalRepo: WithdrawalRepo;
  private debitEligibleAmount: DebitEligibleAmount;

  constructor(withdrawalDao: WithdrawalRepo, debitEligibleAmount: DebitEligibleAmount) {
    this.withdrawalRepo = withdrawalDao;
    this.debitEligibleAmount = debitEligibleAmount;
  }

  async execute(request: WithdrawalRequest) {
    const withdrawal = Withdrawal.create(
      request.amount,
      request.currency,
      request.paymentMethod,
      request.phoneNum,
      request.userId,
      request.taagerId,
    );

    await this.debitEligibleAmount.execute({
      userId: request.userId,
      currency: request.currency,
      serviceTransactionId: withdrawal.withdrawalId,
      serviceType: 'Withdrawals',
      serviceSubType: 'WithdrawalRequested',
      amount: request.amount,
    });

    await this.withdrawalRepo.save(withdrawal);

    const wallet = await findUserWallet({
      userID: request.userId,
      currency: request.currency,
    });

    Logger.info(
      `Action: add_payment_request, By: ${request.userId}, request.amount: ${request.amount}, currency: ${
        request.currency
      }, wallet: ${wallet} `,
      { domain: `wallet`, userId: request.userId },
    );
  }
}


