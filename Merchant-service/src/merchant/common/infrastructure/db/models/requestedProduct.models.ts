import mongoose from 'mongoose';

export type RequestedProductsModel = {
  category: string;
  productDetails: string;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};


