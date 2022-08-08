import mongoose from 'mongoose';

export type FeaturedProductsGroupModel = {
  type: number;
  country: string;
  products: any[];
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};


