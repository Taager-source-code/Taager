import mongoose from 'mongoose';
import AutoIncrement from 'mongoose-sequence';
import { OrderModel } from '../models/orderModel';

const autoIncrement = new AutoIncrement(mongoose);

const orderLineSchema = {
  orderLineId: { type: Number, required: true },
  productId: { type: String, required: true, trim: true },
  quantity: { type: Number, min: 0 },
  totalPrice: { type: Number, required: true },
  totalMerchantProfit: { type: Number, required: true },
  direction: { type: String, enum: ['forward', 'reverse'], required: true, trim: true },
  type: { type: String, enum: ['after_sales', 'initial'], required: true, trim: true },
  status: { type: String, required: true, trim: true },
  trackingNumber: { type: String, required: false, trim: true },
  shippingCompanyId: { type: String, required: false, trim: true },
  originalOrderLineId: { type: String, required: false, trim: true },
  events: [
    {
      eventType: { type: String, require: true, trim: true },
      eventDate: { type: Date, require: true },
      orderLineId: { type: Number, require: false },
      productId: { type: String, require: false, trim: true },
      quantity: { type: Number, require: false },
      totalPrice: { type: Number, require: false },
      direction: { type: String, enum: ['forward', 'reverse'], require: false, trim: true },
      type: { type: String, enum: ['after_sales', 'initial'], require: false, trim: true },
      totalMerchantProfit: { type: Number, require: false },
      trackingNumber: { type: String, require: false, trim: true },
      shippingCompanyId: { type: String, require: false, trim: true },
      confirmedBy: { type: Number, require: false },
    },
  ],
};

const orderSchema = new mongoose.Schema<OrderModel>(
  {
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
    country: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      // required: true,
      trim: true,
    },
    streetName: {
      type: String,
      required: true,
      trim: true,
    },
    buildingNumber: {
      type: String,
      // required: true,
      trim: true,
    },
    apartmentNumber: {
      type: String,
      // required: true,
      trim: true,
    },
    detailedAddress: {
      type: Object,
      required: false,
      default: {},
    },
    orderedProducts: [
      {
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
          min: 0,
        },
        productObjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        productID: {
          type: String,
          required: false,
        },
        returnQuantity: {
          type: Number,
          min: 0,
        },
        replacedQuantity: {
          type: Number,
          min: 0,
        },
        profit: {
          type: Number,
        },
      },
    ],
    phoneNumber: {
      type: String,
      required: true,
    },
    phoneNumber2: {
      type: String,
      required: false,
      default: 0,
    },
    productPrices: [
      {
        type: Number,
      },
    ],
    productQuantities: [
      {
        type: Number,
        min: 0,
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: [],
      },
    ],
    duplicateOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: [],
      },
    ],
    productIds: [
      {
        type: String,
        required: false,
      },
    ],
    assignedAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderedByName: {
      type: String,
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    totalCost: {
      type: Number,
    },
    status: {
      type: String,
      default: 'order_received',
    },
    rating: {
      type: Number,
    },
    complain: {
      type: String,
    },
    pid: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    orderNum: {
      type: Number,
      unique: true,
    },
    orderID: {
      type: String,
      required: false,
      unique: true,
    },
    TagerID: {
      type: Number,
      required: true,
    },
    orderProfit: {
      type: Number,
      required: true,
      default: 0,
    },
    message: {
      type: String,
      required: true,
      default: 'Order Not Rejected',
    },
    shippingNotes: {
      type: String,
      required: false,
      default: '',
    },
    notes: {
      type: String,
      required: false,
      default: 'No Note',
    },
    OrderPhoneNum: {
      type: String,
      required: true,
      default: 'None',
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
    orderReceivedBy: {
      type: String,
      required: false,
      default: '',
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
    confirmationDate: {
      type: Date,
      required: false,
      default: null,
    },
    ConversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderConversation',
    },
    isUserRead: {
      type: Boolean,
      required: false,
      default: false,
    },
    isAdminRead: {
      type: Boolean,
      required: false,
      default: false,
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
    productProfits: [
      {
        type: Number,
      },
    ],
    shippingInfo: {
      type: Object,
      required: false,
    },
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
    hasIssue: {
      type: Boolean,
    },
    shipmentStatus: {
      type: String,
      default: '',
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
    orderSource: {
      type: Object,
      required: false,
      default: {},
    },
    suspendedReason: {
      type: Number,
      required: false,
    },
    delayedReason: {
      type: Number,
      required: false,
    },
    customerRejectedReason: {
      type: Number,
      required: false,
    },
    readyToPickup: {
      type: Boolean,
      required: false,
      default: false,
    },
    orderLines: [orderLineSchema],
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

orderSchema.plugin(autoIncrement, {
  inc_field: 'orderNum',
  start_seq: 1,
  inc_amount: 1,
});

orderSchema.index({ country: 1, shipmentStatus: 1 });
orderSchema.index({ country: 1, isAdminRead: 1 });

export default mongoose.model<OrderModel>('Order', orderSchema);


