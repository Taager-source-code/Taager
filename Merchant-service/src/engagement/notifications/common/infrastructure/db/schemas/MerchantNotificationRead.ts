import mongoose from 'mongoose';
import { MerchantNotificationRead } from '../models/MerchantNotificationRead';

const merchantNotificationReadSchema = new mongoose.Schema<MerchantNotificationRead>(
  {
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    taagerId: {
      type: mongoose.Schema.Types.String,
      index: true,
    },
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification',
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: function(doc, ret) {
        return ret;
      },
    },
  },
);

merchantNotificationReadSchema.index({ merchantId: 1, notificationId: 1 }, { unique: true });

merchantNotificationReadSchema.index({ taagerId: 1, notificationId: 1 }, { unique: true });

export default mongoose.model<MerchantNotificationRead>('MerchantNotificationRead', merchantNotificationReadSchema);


