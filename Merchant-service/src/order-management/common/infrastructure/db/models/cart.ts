/* tslint:disable */
/* eslint-disable */
import mongoose from "mongoose";
import {ProductModel} from "../../../../../content-management/queries/infrastructure/db/models/ProductModel";
import { UserModel } from "../../../../../merchant/common/infrastructure/db/models/userModel";

export type CartProduct = {
  qty?: number;
  product?: ProductModel["_id"] | ProductModel | string;
  preferredMerchantPrice?: number;
  _id?: mongoose.Types.ObjectId | string;
};
export type Cart = {
  userID: UserModel["_id"] | UserModel | string;
  products: CartProduct[] | [];
  _id?: mongoose.Types.ObjectId | string;
  updatedAt?: Date;
  createdAt?: Date;
  country: string;
};


