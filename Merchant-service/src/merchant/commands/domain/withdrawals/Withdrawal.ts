import { v4 as Uuid } from 'uuid';
import { AggregateRoot } from '../../../../shared-kernel/domain/base/AggregateRoot';
import {
  WithdrawalAccepted,
  WithdrawalInProgress,
  WithdrawalRejected,
  WithdrawalRequested,
} from './events/WithdrawalEvents';
import {
  InvalidWithdrawalAmountError,
  MissingRejectionReasonError,
  WithdrawalAlreadyRejected,
} from './exceptions/WithdrawalsExceptions';

export enum WithdrawalStatus {
  PENDING,
  ACCEPTED,
  REJECTED,
  IN_PROGRESS,
}

export interface WithdrawalParameters {
  readonly withdrawalId: string;
  readonly amount: number;
  readonly currency: string;
  readonly paymentMethod: string;
  readonly phoneNum: string;
  readonly userId: string;
  readonly taagerId: number;
  status: WithdrawalStatus;
  rejectReason?: string | null;
}

export default class Withdrawal extends AggregateRoot {
  private parameters: WithdrawalParameters;

  constructor(withdrawalParameters: WithdrawalParameters) {
    super();
    this.parameters = withdrawalParameters;
  }

  static create(
    amount: number,
    currency: string,
    paymentMethod: string,
    phoneNum: string,
    userId: string,
    taagerId: number,
  ): Withdrawal {
    if (amount == 0) {
      throw new InvalidWithdrawalAmountError(`Amount can't be zero`);
    }
    const withdrawal = new Withdrawal({
      withdrawalId: Uuid(),
      amount: amount,
      currency: currency,
      paymentMethod: paymentMethod,
      phoneNum: phoneNum,
      userId: userId,
      status: WithdrawalStatus.PENDING,
      rejectReason: null,
      taagerId: taagerId,
    });
    withdrawal.raiseEvent(new WithdrawalRequested(withdrawal));
    return withdrawal;
  }

  accept() {
    //TODO allow any status for now, until getting in touch with the business
    this.parameters.status = WithdrawalStatus.ACCEPTED;
    this.raiseEvent(new WithdrawalAccepted(this));
  }

  reject(rejectionReason?: string | null) {
    if (!rejectionReason) throw new MissingRejectionReasonError();
    if (this.parameters.status === WithdrawalStatus.REJECTED) throw new WithdrawalAlreadyRejected();
    this.parameters.rejectReason = rejectionReason;
    this.parameters.status = WithdrawalStatus.REJECTED;
    this.raiseEvent(new WithdrawalRejected(this));
  }

  inProgress() {
    this.parameters.status = WithdrawalStatus.IN_PROGRESS;
    this.raiseEvent(new WithdrawalInProgress(this));
  }

  isRejected() {
    return this.parameters.status == WithdrawalStatus.REJECTED;
  }

  get withdrawalId(): string {
    return this.parameters.withdrawalId;
  }

  get amount(): number {
    return this.parameters.amount;
  }

  get currency(): string {
    return this.parameters.currency;
  }

  get paymentMethod(): string {
    return this.parameters.paymentMethod;
  }

  get phoneNum(): string {
    return this.parameters.phoneNum;
  }

  get userId(): string {
    return this.parameters.userId;
  }

  get taagerId(): number {
    return this.parameters.taagerId;
  }

  get status(): WithdrawalStatus {
    return this.parameters.status;
  }

  get rejectReason(): string | null | undefined {
    return this.parameters.rejectReason;
  }
}


