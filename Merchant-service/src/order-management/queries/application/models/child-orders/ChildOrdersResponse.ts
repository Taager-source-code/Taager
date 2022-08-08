import { ParentOrderModel } from './ParentOrderModel';
import { AfterSaleOrderModel } from '../../../infrastructure/db/models/child-orders/AfterSaleOrderModel';

export interface ChildOrdersResponse {
  childOrders: ChildOrderDetails[];
  counted: number;
  endflag: boolean;
}

type ChildOrderDetails = ParentOrderModel & AfterSaleOrderModel;


