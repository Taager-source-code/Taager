import mongoose from 'mongoose';
import { ProvinceModel } from '../models/ProvinceModel';

const provinceSchema = new mongoose.Schema<ProvinceModel>(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    shippingRevenue: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    minETA: {
      type: Number,
      required: true,
    },
    maxETA: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    redZones: {
      type: Array,
      required: false,
      default: [],
    },
    greenZones: {
      type: Array,
      required: false,
      default: [],
    },
    country: {
      type: String,
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

export default mongoose.model<ProvinceModel>('Province', provinceSchema);


