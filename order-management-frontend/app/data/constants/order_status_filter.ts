export const ALL_ORDERS_VALUE = 'All Orders';
export const DELIVERED_STATUS_VALUE = 'Delivered';
export const PROGRESS_STATUS_VALUE = 'Delivery In Progress';
export const ORDER_DELIVERED_STATUS = 'delivered';
export const ORDER_DEVLIVERY_IN_PROGRESS_STATUS = 'delivery_in_progress';
export const ORDER_RECIEVED_STATUS = 'order_received';
export const ORDER_CONFIRMED_STATUS = 'confirmed';
export const ORDER_CUSTOMER_REJECTED = 'customer_rejected';
export interface OrderFilterByStatus {
  name: string;
  value: string;
  active: boolean;
}
