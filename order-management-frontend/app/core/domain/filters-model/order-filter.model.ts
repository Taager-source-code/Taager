export interface OrderFilterModel {
  page: number;
  pageSize: number;
  orderId?: string;
  customerPhoneNum?: string;
  deliveryDate?: string;
  status: string;
  country: string;
}
