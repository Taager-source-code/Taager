import mongoose from 'mongoose';
import { ProductAttribute, ProductModel } from '../models/ProductModel';

const attributeSchema = new mongoose.Schema<ProductAttribute>(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema<ProductModel>(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    prodPurchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    productProfit: {
      type: Number,
      required: true,
      min: 0,
    },
    productQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    productDescription: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
    },
    prodID: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    productWeight: {
      type: Number,
      min: 0,
    },
    Category: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sellerName: {
      type: String,
      required: true,
      trim: true,
    },
    productPicture: {
      type: String,
      required: true,
      trim: true,
    },
    featured: {
      type: Boolean,
      required: true,
      default: false,
    },
    inStock: {
      type: Boolean,
      required: false,
      default: true,
    },
    extraImage1: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    extraImage2: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    extraImage3: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    extraImage4: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    extraImage5: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    extraImage6: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    isExpired: {
      type: Boolean,
      required: false,
      default: false,
    },
    isExternalRetailer: {
      type: Boolean,
      required: false,
      default: false,
    },
    visibleToSellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    productAvailability: {
      type: String,
      required: true,
      trim: true,
      enum: ['available', 'not_available', 'available_with_high_qty', 'available_with_low_qty', 'draft'],
    },
    orderCount: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    additionalMedia: {
      type: Array,
      required: false,
      default: [],
    },
    embeddedVideos: {
      type: Array,
      required: false,
      default: [],
    },
    specifications: {
      type: String,
      required: false,
      trim: true,
    },
    howToUse: {
      type: String,
      required: false,
      trim: true,
    },
    variants: {
      colors: {
        type: Array,
        required: false,
        default: [],
      },
      sizes: {
        type: Array,
        required: false,
        default: [],
      },
      numericSizes: {
        type: Array,
        required: false,
        default: [],
      },
    },
    attributes: [attributeSchema],
  },
  {
    timestamps: true,
    toObject: {
      transform: function(doc, ret) {
        delete ret.prodPurchasePrice;
        delete ret.featured;
        delete ret.isExternalRetailer;
        delete ret.isexternalRetailer;
        return ret;
      },
    },
  },
);

export default mongoose.model<ProductModel>('Product', productSchema);


