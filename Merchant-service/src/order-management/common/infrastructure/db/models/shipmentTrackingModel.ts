/* tslint:disable */
/* eslint-disable */

import mongoose from "mongoose";
import {OrderModel} from "./orderModel";

export type shipmentTrackingModel = {
  orderObjectId?: OrderModel["_id"] | OrderModel;
  orderID: string;
  trackingNumber: string;
  shipmentStatus: string;
  updatedDate?: string;
  reason?: string;
  payload?: any;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};

