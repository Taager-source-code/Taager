import mongoose from 'mongoose';
import { UserFeaturesModel } from '../models/userFeaturesModel';

const userFeaturesSchema = new mongoose.Schema<UserFeaturesModel>(
  {
    feature: {
      type: String,
      required: true,
      trim: true,
    },
    tagerIds: {
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

export default mongoose.model('UserFeatures', userFeaturesSchema);


