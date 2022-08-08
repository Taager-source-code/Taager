import mongoose from 'mongoose';

export type ProvinceModel = {
  location: string;
  branch: string;
  shippingRevenue: number;
  shippingCost: number;
  minETA: number;
  maxETA: number;
  isActive?: boolean;
  redZones?: any[];
  greenZones?: any[];
  _id: string | mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
  country: string;
};


