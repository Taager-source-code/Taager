import mongoose from 'mongoose';
import { CommercialCategoryModel } from '../models/CommercialCategoryModel';

const commercialCategorySchema = new mongoose.Schema<CommercialCategoryModel>(
  {
    englishName: {
      type: String,
      required: true,
      trim: true,
    },
    arabicName: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: false,
      trim: true,
    },
    featured: {
      type: Boolean,
      required: false,
    },
    sorting: {
      type: Number,
      required: false,
    },
    ancestors: [
      {
        type: String,
        index: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<CommercialCategoryModel>('CommercialCategory', commercialCategorySchema);


