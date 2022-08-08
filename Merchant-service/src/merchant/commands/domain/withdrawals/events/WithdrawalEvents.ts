import Withdrawal from '../Withdrawal';
import { DomainEvent } from '../../../../../shared-kernel/domain/base/AggregateRoot';

export abstract class WithdrawalEvent implements DomainEvent {}

export class WithdrawalRequested implements WithdrawalEvent {
  private withdrawal: Withdrawal;

  constructor(withdrawal: Withdrawal) {
    this.withdrawal = withdrawal.clone();
  }
}
export class WithdrawalInProgress implements WithdrawalEvent {
  private withdrawal: Withdrawal;

  constructor(withdrawal: Withdrawal) {
    this.withdrawal = withdrawal.clone();
  }
}
export class WithdrawalAccepted implements WithdrawalEvent {
  private withdrawal: Withdrawal;

  constructor(withdrawal: Withdrawal) {
    this.withdrawal = withdrawal.clone();
  }
}
export class WithdrawalRejected implements WithdrawalEvent {
  private withdrawal: Withdrawal;

  constructor(withdrawal: Withdrawal) {
    this.withdrawal = withdrawal.clone();
  }
}


