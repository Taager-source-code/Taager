/* tslint:disable */
/* eslint-disable */

import mongoose from "mongoose";
import {UserModel} from "../../../../../merchant/common/infrastructure/db/models/userModel";
import {OrderModel} from "./orderModel";
import {ProductModel} from "../../../../../content-management/queries/infrastructure/db/models/ProductModel";

export type OrderIssues = {
  user: {
    userObjectId?: UserModel["_id"] | UserModel;
    TagerId?: string;
  };
  issueType?: number;
  order: {
    orderObjectId?: OrderModel["_id"] | OrderModel;
    OrderId?: string;
  };
  product: {
    productObjectId?: ProductModel["_id"] | ProductModel;
    productQty?: number;
    productId?: string;
    productProfit?: number;
  };
  productReplacement: {
    productObjectId?: ProductModel["_id"] | ProductModel;
    productQty?: number;
    productId?: string;
    productProfit?: number;
  };
  sameProductReplacement?: boolean;
  phoneNum?: string;
  issueReason?: number;
  notes?: string;
  declineReasons?: string;
  resolved?: boolean;
  status?: string;
  issueImage?: string;
  issueVideo?: string;
  _id: mongoose.Types.ObjectId;
  country: string;
  updatedAt?: Date;
  createdAt?: Date;
};


