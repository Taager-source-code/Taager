export const CANCEL = 'cancel';
export const CANCELLED = 'cancelled';
export const CONFIRMED = 'confirmed';
export const CUSTOMER_REFUSED = 'customer_refused';
export const CUSTOMER_REJECTED = 'customer_rejected';
export const DELAYED = 'delayed';
export const DELIVERED = 'delivered';
export const DELIVERY_CANCELLED = 'delivery_cancelled';
export const DELIVERY_IN_PROGRESS = 'delivery_in_progress';
export const DELIVERY_SUSPENDED = 'delivery_suspended';
export const MERGED = 'merged'; // looks like it is still being used - 20831 orders in db at the moment of writing this code and the last created order that has merged status createdAt 2022-05-10T18:34:42.619+00:00
export const ORDER_ADDITION = 'order_addition';
export const ORDER_ADDITION_INPROGRESS = 'order_addition_inprogress';
export const ORDER_DELIVERED = 'order_delivered';
export const ORDER_RECEIVED = 'order_received';
export const PENDING_SHIPPING_COMPANY = 'pending_shipping_company';
export const REFUND_IN_PROGRESS = 'refund_in_progress';
export const REFUND_VERIFIED = 'refund_verified';
export const REPLACEMENT_IN_PROGRESS = 'replacement_in_progress';
export const REPLACEMENT_VERIFIED = 'replacement_verified';
export const RETURN_IN_PROGRESS = 'return_in_progress';
export const RETURN_VERIFIED = 'return_verified';
export const SUSPENDED = 'suspended';
export const TAAGER_CANCELLED = 'taager_cancelled';

export const orderStatuses = [
  CANCEL,
  CANCELLED,
  CONFIRMED,
  CUSTOMER_REFUSED,
  CUSTOMER_REJECTED,
  DELAYED,
  DELIVERED,
  DELIVERY_CANCELLED,
  DELIVERY_IN_PROGRESS,
  DELIVERY_SUSPENDED,
  MERGED,
  ORDER_ADDITION,
  ORDER_ADDITION_INPROGRESS,
  ORDER_DELIVERED,
  ORDER_RECEIVED,
  PENDING_SHIPPING_COMPANY,
  REFUND_IN_PROGRESS,
  REFUND_VERIFIED,
  REPLACEMENT_IN_PROGRESS,
  REPLACEMENT_VERIFIED,
  RETURN_IN_PROGRESS,
  RETURN_VERIFIED,
  SUSPENDED,
  TAAGER_CANCELLED,
];


