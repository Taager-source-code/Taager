import mongoose from 'mongoose';
import { ServiceModel } from '../models/serviceModel';

const servicesSchema = new mongoose.Schema<ServiceModel>(
  {
    serviceName: {
      type: String,
      required: true,
    },
    maxUpdatedAt: {
      type: Date,
      required: false,
      default: null,
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

export default mongoose.model<ServiceModel>('Services', servicesSchema);


