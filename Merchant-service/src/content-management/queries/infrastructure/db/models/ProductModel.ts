import mongoose from 'mongoose';
import { UserModel } from '../../../../../merchant/common/infrastructure/db/models/userModel';
import { Category } from '../../../../common/infrastructure/db/models/categoryModel';

export interface ProductAttribute {
  type: string;
  value: string;
}

export interface ProductModel {
  productName: string;
  productPrice: number;
  prodPurchasePrice: number;
  productProfit: number;
  productQuantity: number;
  productDescription: string;
  prodID: string;
  country: string;
  productWeight?: number;
  Category: string;
  categoryId?: Category['_id'] | Category | string;
  seller?: UserModel['_id'] | UserModel | string;
  sellerName: string;
  productPicture: string;
  featured: boolean;
  inStock?: boolean;
  extraImage1?: string;
  extraImage2?: string;
  extraImage3?: string;
  extraImage4?: string;
  extraImage5?: string;
  extraImage6?: string;
  isExpired?: boolean;
  isExternalRetailer?: boolean;
  visibleToSellers: (UserModel['_id'] | UserModel | string)[];
  productAvailability: 'available' | 'not_available' | 'available_with_high_qty' | 'available_with_low_qty' | 'draft';
  orderCount?: number;
  additionalMedia: any[];
  embeddedVideos: any[];
  specifications?: string;
  howToUse?: string;
  variants: {
    colors: any[];
    sizes: any[];
    numericSizes: any[];
  };
  attributes: ProductAttribute[];
  _id: mongoose.Types.ObjectId | string;
  updatedAt?: Date;
  createdAt?: Date;
}


