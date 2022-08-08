import mongoose from 'mongoose';
import { UserWalletEntity } from '../models/UserWalletEntity';

const userWalletSchema = new mongoose.Schema<UserWalletEntity>(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    currency: {
      type: String,
      required: true,
    },
    totalProfit: {
      type: Number,
      required: false,
      default: 0,
    },
    countOrders: {
      type: Number,
      required: false,
      default: 0,
    },
    eligibleProfit: {
      type: Number,
      required: false,
      default: 0,
    },
    deliveredOrders: {
      type: Number,
      required: false,
      default: 0,
    },
    inprogressProfit: {
      type: Number,
      required: false,
      default: 0,
    },
    inprogressOrders: {
      type: Number,
      required: false,
      default: 0,
    },
    incomingProfit: {
      type: Number,
      required: false,
      default: 0,
    },
    receivedOrders: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
    toObject: {
      transform(doc, ret) {
        return ret;
      },
    },
  },
);
userWalletSchema.index({ userID: 1, currency: 1 }, { unique: true });

export default mongoose.model<UserWalletEntity>('userWallet', userWalletSchema);


