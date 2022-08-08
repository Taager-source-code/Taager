import mongoose from 'mongoose';
import { ProductModel } from '../../../../../content-management/queries/infrastructure/db/models/ProductModel';

export interface FavouriteProductsProductModel {
  _id?: ProductModel['_id'] | ProductModel;
  price?: number;
  customPrice?: number;
}

export interface FavouriteProductModel {
  taagerId: number;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
  products: FavouriteProductsProductModel[];
  country: string;
}


