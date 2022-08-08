/* tslint:disable */
/* eslint-disable */

import mongoose from "mongoose";
import {OrderModel} from "./orderModel";


export type OrderConversation = {
  orderObjectId?: OrderModel["_id"] | OrderModel;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};

