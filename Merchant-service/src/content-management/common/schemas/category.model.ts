import mongoose from 'mongoose';
import { Category } from '../models/categoryModel';

const categorySchema = new mongoose.Schema<Category>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    sorting: {
      type: Number,
      required: true,
    },
    featured: {
      type: Boolean,
      required: false,
      default: false,
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

export default mongoose.model<Category>('Category', categorySchema);


