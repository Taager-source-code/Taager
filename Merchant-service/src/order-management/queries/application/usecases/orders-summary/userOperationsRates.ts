export default class UserOperationsRate {
  public confirmationRate = '0';
  public deliveryRate = '0';
  constructor(total, confirmedCount, deliveredCount) {
    if (total !== 0) {
      this.confirmationRate = ((confirmedCount / total) * 100).toFixed(2);
      this.deliveryRate = ((deliveredCount / confirmedCount) * 100).toFixed(2);
    }
  }
}


