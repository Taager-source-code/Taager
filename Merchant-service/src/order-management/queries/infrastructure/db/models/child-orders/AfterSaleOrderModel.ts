/* tslint:disable */
/* eslint-disable */

import mongoose from "mongoose";
import {OrderModel} from "../../../../../common/infrastructure/db/models/orderModel";
import {OrderIssues} from "../../../../../common/infrastructure/db/models/orderIssues";
import {ProductModel} from "../../../../../../content-management/queries/infrastructure/db/models/ProductModel";

export type AfterSaleOrderModel = {
  orderID: string;
  parentOrderObjectId?: OrderModel["_id"] | OrderModel | string;
  parentOrderId?: string;
  orderIssueID?: OrderIssues["_id"] | OrderIssues | string;
  product: {
    productObjectId?: ProductModel["_id"] | ProductModel | string;
    name?: string;
    productQty?: number;
    productId?: string;
    productProfit?: number;
    productPrice?: number;
  };
  status: string;
  cashRefunded?: number;
  orderProfit: number;
  receiverName: string;
  province: string;
  streetName: string;
  zone: {
    name?: string;
    status?: string;
  };
  phoneNumber: string;
  phoneNumber2?: string;
  cashOnDelivery?: number;
  shippingInfo?: any;
  pickupDate?: Date | string;
  deliverySuspendedReason?: string;
  deliveryDate?: Date | string;
  _id: mongoose.Types.ObjectId | string;
  updatedAt?: Date | string;
  createdAt?: Date | string;
  country: string;
};

