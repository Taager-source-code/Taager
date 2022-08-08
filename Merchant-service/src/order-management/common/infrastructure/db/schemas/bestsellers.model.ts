import mongoose from 'mongoose';
import { BestsellersModel } from '../models/bestsellersModel';

const bestsellersSchema = new mongoose.Schema<BestsellersModel>(
  {
    bestsellersList: [
      {
        categoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
        },
        products: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            default: [],
          },
        ],
      },
    ],
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

export default mongoose.model<BestsellersModel>('Bestsellers', bestsellersSchema);


