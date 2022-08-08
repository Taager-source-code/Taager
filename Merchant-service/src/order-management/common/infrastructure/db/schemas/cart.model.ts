import mongoose from 'mongoose';
import { Cart } from '../models/cart';

const cartSchema = new mongoose.Schema<Cart>(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        qty: {
          type: Number,
          min: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        preferredMerchantPrice: {
          type: Number,
        },
      },
    ],
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

cartSchema.index({ userID: 1, country: 1 }, { unique: true });

export default mongoose.model<Cart>('Cart', cartSchema);


