import mongoose from 'mongoose';
import {
  VariantGroupModel,
  VariantGroupAttributeSet,
  VariantGroupAttributeSetAttribute,
} from '../models/VariantGroupModel';
import { secondaryConnection } from '../../../../../shared-kernel/infrastructure/config/mongoose-secondary';

const attributeSchema = new mongoose.Schema<VariantGroupAttributeSetAttribute>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const attributeSetSchema = new mongoose.Schema<VariantGroupAttributeSet>(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    attributes: [attributeSchema],
  },
  { _id: false },
);

const variantGroupSchema = new mongoose.Schema<VariantGroupModel>(
  {
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    country: {
      type: String,
      required: true,
    },
    primaryVariant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    attributeSets: [attributeSetSchema],
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    commercialCategoryIds: [
      {
        type: String,
        index: true,
      },
    ],
    visibleToSellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);
variantGroupSchema.index({ variants: 1 });

export default secondaryConnection.model<VariantGroupModel>('VariantGroup', variantGroupSchema);


