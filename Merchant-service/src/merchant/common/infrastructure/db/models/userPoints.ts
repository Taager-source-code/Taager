import mongoose from 'mongoose';
import { UserModel } from './userModel';

export type UserPointModel = {
  pointsCount: number;
  dateNumber: string;
  userId?: UserModel['_id'] | UserModel;
  status?: string;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};


