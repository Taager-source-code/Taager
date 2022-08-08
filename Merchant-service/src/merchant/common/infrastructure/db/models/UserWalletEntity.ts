import { UserModel } from './userModel';

export type UserWalletEntity = {
  _id?: string;
  userID: UserModel['_id'] | UserModel | string;
  currency: string;
  totalProfit?: number;
  countOrders?: number;
  eligibleProfit: number;
  deliveredOrders?: number;
  inprogressProfit?: number;
  inprogressOrders?: number;
  incomingProfit?: number;
  receivedOrders?: number;
  updatedAt?: Date;
  createdAt?: Date;
};


