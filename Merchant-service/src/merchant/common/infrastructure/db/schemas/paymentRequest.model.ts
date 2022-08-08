import mongoose from 'mongoose';
import { WithdrawalEntity } from '../models/WithdrawalEntity';

const paymentRequestSchema = new mongoose.Schema<WithdrawalEntity>(
  {
    withdrawalId: {
      type: String,
      required: true,
      unique: true,
    },
    currency: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentWay: {
      type: String,
      required: true,
    },
    phoneNum: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      required: true,
    },
    rejectReason: {
      type: String,
      required: false,
      default: '',
    },
    taagerId: {
      type: Number,
      required: true,
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

export default mongoose.model<WithdrawalEntity>('paymentRequest', paymentRequestSchema);


