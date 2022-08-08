export default class OrderStatusCount {
  count: number;
  orderStatus: string;
  constructor(orderStatus, count) {
    this.orderStatus = orderStatus;
    this.count = count;
  }

  static fromRow(row) {
    return new OrderStatusCount(row.ORDER_STATUS, row.TOTAL);
  }
}


