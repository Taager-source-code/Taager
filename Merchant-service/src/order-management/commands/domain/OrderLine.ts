export default class OrderLine {
  public orderLineId: number;
  public productId: string;
  public quantity: number;
  public totalPrice: number;
  public totalMerchantProfit: number;
  public direction: OrderLineDirection;
  public type: OrderLineType;
  public status: OrderLineStatus;
  public trackingNumber?: string;
  public shippingCompanyId?: string;
  public originalOrderLineId?: string;
  public events: OrderLineEvent[];

  constructor(
    orderLineId: number,
    productId: string,
    quantity: number,
    totalPrice: number,
    totalMerchantProfit: number,
    direction: OrderLineDirection,
    type: OrderLineType,
    status: OrderLineStatus,
    events: OrderLineEvent[],
    trackingNumber?: string,
    shippingCompanyId?: string,
    originalOrderLineId?: string,
  ) {
    this.orderLineId = orderLineId;
    this.productId = productId;
    this.quantity = quantity;
    this.totalPrice = totalPrice;
    this.totalMerchantProfit = totalMerchantProfit;
    this.direction = direction;
    this.type = type;
    this.status = status;
    this.events = events;
    this.trackingNumber = trackingNumber;
    this.shippingCompanyId = shippingCompanyId;
    this.originalOrderLineId = originalOrderLineId;
  }

  static newOrderLine(
    orderLineId: number,
    productId: string,
    quantity: number,
    totalPrice: number,
    totalMerchantProfit: number,
  ): OrderLine {
    return new OrderLine(
      orderLineId,
      productId,
      quantity,
      totalPrice,
      totalMerchantProfit,
      OrderLineDirection.FORWARD,
      OrderLineType.INITIAL,
      OrderLineStatus.CREATED,
      [
        {
          eventType: OrderLineEventType.Created,
          eventDate: new Date(),
          orderLineId: orderLineId,
          productId: productId,
          quantity: quantity,
          totalPrice: totalPrice,
          totalMerchantProfit: totalMerchantProfit,
          direction: OrderLineDirection.FORWARD,
          type: OrderLineType.INITIAL,
        },
      ],
    );
  }
}

export type OrderLineEvent = {
  eventType: OrderLineEventType;
  eventDate: Date;
  orderLineId?: number;
  productId?: string;
  quantity?: number;
  totalPrice?: number;
  direction?: OrderLineDirection;
  type?: OrderLineType;
  totalMerchantProfit?: number;
  trackingNumber?: string;
  shippingCompanyId?: string;
  confirmedBy?: number;
};

export const OrderLineEventType = {
  Created: 'created',
} as const;
export type OrderLineEventType = typeof OrderLineEventType[keyof typeof OrderLineEventType];

export const OrderLineStatus = {
  CREATED: 'created',
  TAAGER_CANCELLED: 'taager_cancelled',
} as const;
export type OrderLineStatus = typeof OrderLineStatus[keyof typeof OrderLineStatus];

export const OrderLineDirection = {
  FORWARD: 'forward',
  REVERSE: 'reverse',
} as const;
export type OrderLineDirection = typeof OrderLineDirection[keyof typeof OrderLineDirection];

export const OrderLineType = {
  INITIAL: 'initial',
  AFTER_SALES: 'after_sales',
} as const;
export type OrderLineType = typeof OrderLineType[keyof typeof OrderLineType];


