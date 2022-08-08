import { Service } from 'typedi';

import { WithdrawalNotFoundError } from '../exceptions/WithdrawalsExceptions';
import UpdateWithdrawalRequest from '../models/UpdateWithdrawalRequest';

import CreditEligibleAmount from '../../wallet/usecases/CreditEligibleAmount';

import {
  APP_STATUS_ACCEPTED,
  APP_STATUS_IN_PROGRESS,
  APP_STATUS_REJECTED,
} from '../../../../common/application/WithdrawalStatus';
import WithdrawalRepo from '../../../infrastrcuture/withdrawals/repositories/WithdrawalRepo';
import { findUserWallet } from '../../usecases/userWallet.service';
import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';

@Service({ global: true })
export default class UpdateWithdrawal {
  private withdrawalRepo: WithdrawalRepo;
  private creditEligibleAmount: CreditEligibleAmount;

  constructor(withdrawalDao: WithdrawalRepo, creditEligibleAmount: CreditEligibleAmount) {
    this.withdrawalRepo = withdrawalDao;
    this.creditEligibleAmount = creditEligibleAmount;
  }

  async execute(request: UpdateWithdrawalRequest) {
    const withdrawal = await this.withdrawalRepo.getById(request.withdrawalId);

    if (!withdrawal) throw new WithdrawalNotFoundError();

    if (withdrawal.isRejected()) {
      await this.creditEligibleAmount.execute({
        userId: withdrawal.userId,
        currency: withdrawal.currency,
        serviceTransactionId: withdrawal.withdrawalId,
        serviceType: 'Withdrawals',
        serviceSubType: 'WithdrawalRejected',
        amount: withdrawal.amount,
      });
    }

    const fromStatus = withdrawal.status;
    if (request.status == APP_STATUS_REJECTED) {
      withdrawal.reject(request.rejectReason);
    } else if (request.status == APP_STATUS_IN_PROGRESS) {
      withdrawal.inProgress();
    } else if (request.status == APP_STATUS_ACCEPTED) {
      withdrawal.accept();
    }

    await this.withdrawalRepo.save(withdrawal);

    const wallet = await findUserWallet({ userID: withdrawal.userId });

    if (wallet) {
      Logger.info(
        `Action: update_payment_request, By: ${request.adminId}, fromStatus: ${fromStatus}, toStatus: ${
          request.status
        }, request.amount: ${withdrawal.amount}, wallet: ${wallet} `,
        { domain: `wallet`, userId: withdrawal.userId },
      );
    }
  }
}


