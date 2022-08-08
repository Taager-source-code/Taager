import mongoose from 'mongoose';
import { RequestedProductsModel } from '../../../../../merchant/common/infrastructure/db/models/requestedProduct.models';

const requestedProductSchema = new mongoose.Schema<RequestedProductsModel>(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    productDetails: {
      type: String,
      required: true,
      trim: true,
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

export default mongoose.model<RequestedProductsModel>('RequestedProducts', requestedProductSchema);


