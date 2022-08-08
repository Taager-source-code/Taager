import mongoose from 'mongoose';
import { FeaturedProductsGroupModel } from '../models/featuredProductsGroupModel';

const featuredProductsGroupSchema = new mongoose.Schema<FeaturedProductsGroupModel>(
  {
    type: {
      type: Number,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    products: {
      type: Array,
      required: true,
      default: [],
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

export default mongoose.model<FeaturedProductsGroupModel>('FeaturedProductsGroup', featuredProductsGroupSchema);


