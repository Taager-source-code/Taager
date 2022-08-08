export interface OrderEntity {
  orderId: string;
  status: 'delivered' | 'delivery_in_progress';
  placedAt?: string;
  deliveredAt: string;
  customerDetails: CustomerEntity;
  shippingInfo?: OrderDetailShippingEntity;
  orderLines?: OrderDetailsEntity[];
  cashOnDelivery: number;
}
export interface CustomerEntity {
    customerName: string;
    customerPhoneNum1: string;
    customerPhoneNum2: string;
}
export interface OrderResponseEntity {
   data: {
    count: number;
    orders: OrderEntity[];
   };
}
export interface OrderDetailResponseEntity {
    data: OrderEntity;
}
export interface OrderDetailShippingEntity {
    province: string;
    zone: {
        name: string;
        status: string;
    };
    address: {
        apartment: string;
        building: string;
        floor: string;
        landmark: string;
        streetName: string;
    };
}
export interface OrderDetailsEntity {
    orderLineId: number;
    productId: string;
    productName: string;
    quantity: number;
    totalPrice: number;
    type: string;
    status: string;
    trackingNumber: string;
    shippingCompanyId: string;
    direction: string;
}
