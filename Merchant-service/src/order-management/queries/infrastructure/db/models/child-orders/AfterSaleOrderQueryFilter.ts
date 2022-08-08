export type AfterSaleOrderQueryFilter = {
  country?: string;
  status?: string;
  orderID?: string | number;
  parentOrderId?: string | number;
  taagerID?: string | number;
  fromDate?: string | Date;
  toDate?: string | Date;
  filter?: string | number;
};


