import Withdrawal, { WithdrawalStatus } from '../../../domain/withdrawals/Withdrawal';
import {
  DB_STATUS_IN_PROGRESS,
  DB_STATUS_RECEIVED,
  DB_STATUS_REJECTED,
  DB_STATUS_SUCCESSFUL,
  WithdrawalEntity,
} from '../../../../common/infrastructure/db/models/WithdrawalEntity';

export default class WithdrawalConverter {
  static toDB(domain: Withdrawal): WithdrawalEntity {
    return {
      withdrawalId: domain.withdrawalId,
      currency: domain.currency,
      amount: domain.amount,
      paymentWay: domain.paymentMethod,
      phoneNum: domain.phoneNum,
      userId: domain.userId,
      status: this.statusToDB(domain.status),
      rejectReason: domain.rejectReason,
      taagerId: domain.taagerId,
    };
  }

  static toDomain(entity: WithdrawalEntity): Withdrawal {
    return new Withdrawal({
      withdrawalId: entity.withdrawalId,
      currency: entity.currency,
      amount: entity.amount,
      paymentMethod: entity.paymentWay,
      phoneNum: entity.phoneNum,
      userId: entity.userId.toString(),
      status: this.statusToDomain(entity.status),
      rejectReason: entity.rejectReason,
      taagerId: entity.taagerId,
    });
  }

  private static statusToDB(status: WithdrawalStatus): string {
    switch (status) {
      case WithdrawalStatus.PENDING:
        return DB_STATUS_RECEIVED;
      case WithdrawalStatus.ACCEPTED:
        return DB_STATUS_SUCCESSFUL;
      case WithdrawalStatus.REJECTED:
        return DB_STATUS_REJECTED;
      case WithdrawalStatus.IN_PROGRESS:
        return DB_STATUS_IN_PROGRESS;
    }
    throw new Error(`new status not mapped to db: ${status}`);
  }

  private static statusToDomain(status: string): WithdrawalStatus {
    switch (status) {
      case DB_STATUS_RECEIVED:
        return WithdrawalStatus.PENDING;
      case DB_STATUS_SUCCESSFUL:
        return WithdrawalStatus.ACCEPTED;
      case DB_STATUS_REJECTED:
        return WithdrawalStatus.REJECTED;
      case DB_STATUS_IN_PROGRESS:
        return WithdrawalStatus.IN_PROGRESS;
    }
    throw new Error(`incorrect status from database: ${status}`);
  }
}


