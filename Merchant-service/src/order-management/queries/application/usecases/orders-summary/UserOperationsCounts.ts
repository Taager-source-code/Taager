export default class UserOperationsCounts {
  public total: any;
  public confirmedCount: any;
  public deliveredCount: any;

  constructor(total, confirmedCount, deliveredCount) {
    this.total = total;
    this.confirmedCount = confirmedCount;
    this.deliveredCount = deliveredCount;
  }

  static fromRow(row) {
    return new UserOperationsCounts(
      row[0].TOTAL_ORDERS_COUNT || 0,
      row[0].TOTAL_CONFIRMED_ORDERS || 0,
      row[0].TOTAL_DELIVERED_ORDERS || 0,
    );
  }
}


