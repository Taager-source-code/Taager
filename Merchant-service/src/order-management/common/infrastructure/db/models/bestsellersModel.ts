/* tslint:disable */
/* eslint-disable */
// TODO - Zia find a specific type of error to disable instead of the whole lint

import mongoose from "mongoose";
import {Category} from "../../../../../content-management/common/infrastructure/db/models/categoryModel";
import {ProductModel} from "../../../../../content-management/queries/infrastructure/db/models/ProductModel";

export type BestsellerItem = {
  categoryId?: Category['_id'] | Category;
  products: (ProductModel['_id'] | ProductModel)[];
  _id: mongoose.Types.ObjectId;
};

export type BestsellersModel = {
  bestsellersList: BestsellerItem[];
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};


