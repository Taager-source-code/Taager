/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { BundleVariantEntity } from './bundle-variant.entity';
export interface BundleEntity {
    _id?: string;
    productName: string; // should be same as variant group name
    productPrice: number;
    prodPurchasePrice: number; // leave as zero for now
    productProfit: number;
    productQuantity: number; // because it is one bundle
    productDescription: string;
    prodID: string;
    Category: string;
    productPicture: string;
    extraImage1: string;
    extraImage2: string;
    extraImage3: string;
    extraImage4: string;
    extraImage5: string;
    extraImage6: string;
    productAvailability: string;
    orderCount: number; // have it as 1
    isPrimary: boolean; // have it as true as it is the only item
    attributes: Array<{
        type: string;
        value: string;
    }>;
    type: 'bundle';
    bundleVariants: Array<BundleVariantEntity>;
    visibleToSellers: Array<string>;
    embeddedVideos: Array<string>;
    specifications: string;
    additionalMedia?: string[];
    isExpired: boolean;
}
export interface BundleGroupEntity {
    _id?: string;
    name: string;
    categoryId: string;
    internalCategoryId: string;
    commercialCategoryIds: Array<string>;
    country: string;
    visibleToSellers: Array<string>;
    attributeSets: Array<{
        type: string;
        attributes: Array<{name: string}>;
    }>;
    variants: Array<BundleEntity>;
    primaryVariant?: BundleEntity | string;
  }
export interface PaginatedBundleGroupListEntity {
    counted: number;
    isLastPage: boolean;
    variantGroups: BundleGroupEntity[];
}
