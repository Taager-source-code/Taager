/* tslint:disable */
/* eslint-disable */


import mongoose from "mongoose";
import {OrderModel} from "./orderModel";
import {UserModel} from "../../../../../merchant/common/infrastructure/db/models/userModel";


export type OrderActivities = {
  orderObjectId?: OrderModel["_id"] | OrderModel;
  orderID: string;
  orderStatus: string;
  notes?: string;
  streetName?: string;
  trackingId?: string;
  deliveryNotes?: string;
  isOrderVerified?: boolean;
  deliveryDate?: Date;
  replacementDate?: Date;
  cashOnDelivery?: number;
  pickupDate?: Date;
  deliverySuspendedReason?: string;
  province?: string;
  phoneNumber?: string;
  receiverName?: string;
  productQuantities: number[];
  orderProfit?: number;
  productPrices: number[];
  productReturnQuantities: number[];
  productReplacedQuantities: number[];
  adminUserId?: UserModel["_id"] | UserModel;
  productProfits: number[];
  failedAttemptsCount?: number;
  failedAttemptNote?: string;
  mergeableOrders: (OrderModel["_id"] | OrderModel)[];
  suspendedReason?: number;
  customerRejectedReason?: number;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};


