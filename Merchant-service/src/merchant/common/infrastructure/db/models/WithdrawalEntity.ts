import mongoose from 'mongoose';
import { UserModel } from './userModel';

export type WithdrawalEntity = {
  _id?: mongoose.Types.ObjectId | string;
  withdrawalId: string;
  amount: number;
  currency: string;
  paymentWay: string;
  phoneNum: string;
  userId: UserModel['_id'] | UserModel | string;
  status: string;
  rejectReason?: string | null;
  updatedAt?: Date;
  createdAt?: Date;
  taagerId: number;
};

export const DB_STATUS_RECEIVED = 'received';
export const DB_STATUS_SUCCESSFUL = 'successful';
export const DB_STATUS_REJECTED = 'rejected';
export const DB_STATUS_IN_PROGRESS = 'inprogress';


