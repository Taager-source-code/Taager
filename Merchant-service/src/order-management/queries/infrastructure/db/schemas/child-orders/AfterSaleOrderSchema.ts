import mongoose from 'mongoose';
import { AfterSaleOrderModel } from '../../models/child-orders/AfterSaleOrderModel';

const schemaDefinition = {
  orderID: {
    type: String,
    required: true,
    unique: true,
  },
  parentOrderObjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  parentOrderId: {
    type: String,
  },
  orderIssueID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderIssues',
  },
  product: {
    productObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: {
      type: String,
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
    productPrice: {
      type: Number,
    },
  },
  status: {
    type: String,
    required: true,
  },
  cashRefunded: {
    type: Number,
    default: 0,
  },
  orderProfit: {
    type: Number,
    required: true,
    default: 0,
  },
  receiverName: {
    type: String,
    required: true,
    trim: true,
  },
  province: {
    type: String,
    required: true,
    trim: true,
  },
  streetName: {
    type: String,
    required: true,
    trim: true,
  },
  zone: {
    name: {
      type: String,
      required: false,
      default: '',
    },
    status: {
      type: String,
      required: false,
      default: '',
    },
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  phoneNumber2: {
    type: String,
    required: false,
    default: 0,
  },
  cashOnDelivery: {
    type: Number,
    required: false,
  },
  shippingInfo: {
    type: Object,
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
  deliveryDate: {
    type: Date,
    required: false,
    default: null,
  },
  country: {
    type: String,
    required: true,
  },
};
const options = {
  timestamps: true,
  toObject: {
    transform: function(doc, ret) {
      return ret;
    },
  },
};

const afterSaleOrderSchema = new mongoose.Schema<AfterSaleOrderModel>(schemaDefinition, options);
export default mongoose.model<AfterSaleOrderModel>('AfterSaleOrder', afterSaleOrderSchema);


