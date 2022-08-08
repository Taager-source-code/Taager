import {
  DB_STATUS_IN_PROGRESS,
  DB_STATUS_RECEIVED,
  DB_STATUS_REJECTED,
  DB_STATUS_SUCCESSFUL,
  WithdrawalEntity,
} from '../../../../common/infrastructure/db/models/WithdrawalEntity';
import Withdrawal from '../../../application/withdrawals/models/Withdrawal';
import { UserModel } from '../../../../common/infrastructure/db/models/userModel';
import {
  APP_STATUS_ACCEPTED,
  APP_STATUS_IN_PROGRESS,
  APP_STATUS_REJECTED,
  APP_STATUS_PENDING,
} from '../../../../common/application/WithdrawalStatus';

export default class WithdrawalConverter {
  static toApplication(entity: WithdrawalEntity): Withdrawal {
    const user = entity.userId as UserModel;
    const withdrawal: Withdrawal = {
      id: entity.withdrawalId,
      taagerId: user.TagerID,
      fullName: user.fullName,
      amount: entity.amount,
      currency: entity.currency,
      paymentMethod: entity.paymentWay,
      phoneNum: entity.phoneNum,
      status: this.statusToApplication(entity.status),
      createdAt: entity.createdAt,
    };
    if (entity.rejectReason) withdrawal.rejectReason = entity.rejectReason;
    return withdrawal;
  }

  static statusToDB(status: string): string {
    switch (status) {
      case APP_STATUS_PENDING:
        return DB_STATUS_RECEIVED;
      case APP_STATUS_ACCEPTED:
        return DB_STATUS_SUCCESSFUL;
      case APP_STATUS_REJECTED:
        return DB_STATUS_REJECTED;
      case APP_STATUS_IN_PROGRESS:
        return DB_STATUS_IN_PROGRESS;
    }
    throw new Error(`incorrect status from database: ${status}`);
  }

  private static statusToApplication(status: string): string {
    switch (status) {
      case DB_STATUS_RECEIVED:
      case DB_STATUS_IN_PROGRESS:
        return APP_STATUS_PENDING;
      case DB_STATUS_SUCCESSFUL:
        return APP_STATUS_ACCEPTED;
      case DB_STATUS_REJECTED:
        return APP_STATUS_REJECTED;
    }
    throw new Error(`incorrect status from database: ${status}`);
  }
}


