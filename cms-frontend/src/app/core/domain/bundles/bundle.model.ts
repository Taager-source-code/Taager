/* eslint-disable @typescript-eslint/naming-convention */
import { AttributeSet, VariantAttribute, VariantModel } from '../variant-group.model';
import { BundleVariantModel } from './bundle-variant.model';
export interface BundleModel {
    _id?: string;
    productId: string;
    productName: string;
    price: number;
    purchasePrice: number;
    profit: number;
    variantImages: Array<string>;
    videosLinks: Array<string>;
    description: string;
    specifications: string;
    attributes?: Array<VariantAttribute>;
    isExpired: boolean;
    quantity: number;
    productAvailability: string;
    isPrimary: boolean;
    orderCount: number;
    visibleToSellers: string[];
    Category: string;
    type: 'bundle';
    bundleVariants: Array<BundleVariantModel>;
}
export interface BundleGroupModel {
    _id?: string;
    categoryId: string;
    name: string;
    country: string;
    variants: BundleModel[];
    primaryVariant?: BundleModel;
    primaryVariantId?: string;
    visibleToSellers: string[];
    attributeSets: Array<{
        type: string;
        attributes: Array<{name: string}>;
    }>;
    internalCategoryId: string;
    commercialCategoryIds: string[];
}