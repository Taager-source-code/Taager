export interface CustomerModel {
    customerName: string;
    customerPhoneNum1: string;
    customerPhoneNum2: string;
}
export interface ShippingModel {
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
export interface OrderDetailsModel {
    orderLineId: number;
    productId: string;
    productName: string;
    quantity: number;
    pricePerPiece: number;
    type: string;
    status: string;
    trackingNumber: string;
    shippingCompanyId: string;
    direction: string;
}
export interface OrderModel {
    orderId: string;
    status: 'delivered' | 'delivery_in_progress';
    placedAt?: string;
    deliveredAt: string;
    customerDetails: CustomerModel;
    shippingInfo?: ShippingModel;
    orderLines?: OrderDetailsModel[];
    cashOnDelivery: number;
}
export interface OrderModelStructure {
    count: number;
    result: OrderModel[];
}
export const FORWARD_VALUE = 'forward';
