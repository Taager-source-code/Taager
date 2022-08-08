import mongoose from 'mongoose';
import { FavouriteProductModel } from '../models/favouriteProductModel';

const favouriteProductsSchema = new mongoose.Schema<FavouriteProductModel>(
  {
    taagerId: {
      type: Number,
      required: true,
    },
    products: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
          },
          price: {
            type: Number,
          },
          customPrice: {
            type: Number,
          },
        },
      ],
      required: true,
      default: [],
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
favouriteProductsSchema.index({ taagerId: 1, country: 1 }, { unique: true });
export default mongoose.model<FavouriteProductModel>('FavouriteProducts', favouriteProductsSchema);


