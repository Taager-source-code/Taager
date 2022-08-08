import mongoose from 'mongoose';
import { OrderActivities } from '../models/orderActivity';

const orderActivitySchema = new mongoose.Schema<OrderActivities>(
  {
    orderObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    orderID: {
      type: String,
      required: true,
      trim: true,
    },
    orderStatus: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      required: false,
      trim: true,
    },
    streetName: {
      type: String,
      required: false,
      trim: true,
    },
    trackingId: {
      type: String,
      required: false,
      default: '',
    },
    deliveryNotes: {
      type: String,
      required: false,
      default: '',
    },
    isOrderVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    deliveryDate: {
      type: Date,
      required: false,
      default: null,
    },
    replacementDate: {
      type: Date,
      required: false,
      default: null,
    },
    cashOnDelivery: {
      type: Number,
      required: false,
    },
    pickupDate: {
      type: Date,
      required: false,
      default: null,
    },
    deliverySuspendedReason: {
      type: String,
      default: '',
    },
    province: {
      type: String,
      required: false,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    receiverName: {
      type: String,
      required: false,
      trim: true,
    },
    productQuantities: [
      {
        type: Number,
        min: 0,
      },
    ],
    orderProfit: {
      type: Number,
      required: false,
      default: 0,
    },
    productPrices: [
      {
        type: Number,
      },
    ],
    productReturnQuantities: [
      {
        type: Number,
        min: 0,
      },
    ],
    productReplacedQuantities: [
      {
        type: Number,
        min: 0,
      },
    ],
    adminUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    productProfits: [
      {
        type: Number,
      },
    ],
    failedAttemptsCount: {
      type: Number,
      required: false,
      default: 0,
    },
    failedAttemptNote: {
      type: String,
      default: '',
    },
    mergeableOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: [],
      },
    ],
    suspendedReason: {
      type: Number,
      required: false,
    },
    customerRejectedReason: {
      type: Number,
      required: false,
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

export default mongoose.model<OrderActivities>('OrderActivities', orderActivitySchema);


