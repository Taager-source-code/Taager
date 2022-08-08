export interface GetChildOrdersRequest {
  page: number;
  pageSize: number;
  queryOptions: {
    country?: string;
    status?: string;
    orderID?: string;
    parentOrderId?: string;
    taagerID?: number;
    fromDate?: string;
    toDate?: string;
  };
}


