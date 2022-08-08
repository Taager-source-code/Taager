import mongoose from 'mongoose';

export type ServiceModel = {
  serviceName: string;
  maxUpdatedAt?: Date;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};


