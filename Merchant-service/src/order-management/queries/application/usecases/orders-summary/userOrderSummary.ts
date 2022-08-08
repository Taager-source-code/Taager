export default class UserOrdersSummary {
  confirmed: number;
  confirmedPercentage: string;
  delivered: number;
  deliveredPercentage: string;
  inProgress: number;
  inProgressPercentage: string;
  pending: number;
  pendingPercentage: string;
  suspended: number;
  suspendedPercentage: string;
  total: number;

  constructor(pending, confirmed, suspended, delivered, inProgress) {
    this.pending = pending;
    this.confirmed = confirmed;
    this.suspended = suspended;
    this.delivered = delivered;
    this.inProgress = inProgress;

    // calculate total
    this.total = pending + confirmed + suspended + delivered + inProgress;

    // calculate percentages
    this.pendingPercentage = this.getPercentage(this.pending);
    this.confirmedPercentage = this.getPercentage(this.confirmed);
    this.suspendedPercentage = this.getPercentage(this.suspended);
    this.deliveredPercentage = this.getPercentage(this.delivered);
    this.inProgressPercentage = this.getPercentage(this.inProgress);
  }

  getPercentage(value): string {
    if (this.total === 0) return '0';
    return ((value / this.total) * 100).toFixed(2);
  }
}


