import mongoose from 'mongoose';
import { OrderIssues } from '../models/orderIssues';

const orderIssuesSchema = new mongoose.Schema<OrderIssues>(
  {
    user: {
      userObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      TagerId: {
        type: String,
      },
    },
    issueType: {
      type: Number,
    },
    order: {
      orderObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
      OrderId: {
        type: String,
      },
    },
    product: {
      productObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      productQty: {
        type: Number,
      },
      productId: {
        type: String,
      },
      productProfit: {
        type: Number,
      },
    },
    productReplacement: {
      productObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      productQty: {
        type: Number,
      },
      productId: {
        type: String,
      },
      productProfit: {
        type: Number,
      },
    },
    sameProductReplacement: {
      type: Boolean,
    },
    phoneNum: {
      type: String,
    },
    issueReason: {
      type: Number,
    },
    notes: {
      type: String,
    },
    declineReasons: {
      type: String,
    },
    resolved: {
      type: Boolean,
    },
    status: {
      type: String,
      required: false,
      default: '',
    },
    issueImage: {
      type: String,
    },
    issueVideo: {
      type: String,
    },
    country: {
      type: String,
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

export default mongoose.model<OrderIssues>('OrderIssues', orderIssuesSchema);


