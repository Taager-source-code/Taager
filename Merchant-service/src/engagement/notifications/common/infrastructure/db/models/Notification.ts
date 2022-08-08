import mongoose from 'mongoose';
import { UserModel } from '../../../../../../merchant/common/infrastructure/db/models/userModel';
import { Notification } from './Notification';

export type MerchantNotificationRead = {
  merchantId: UserModel['_id'] | UserModel;
  taagerId: UserModel['TagerID'] | UserModel;
  notificationId: Notification['_id'] | Notification;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};


