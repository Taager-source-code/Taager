import mongoose from 'mongoose';

export type UserFeaturesModel = {
  feature: string;
  tagerIds: string;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};


