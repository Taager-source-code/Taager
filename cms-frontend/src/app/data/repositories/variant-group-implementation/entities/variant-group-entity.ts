/* eslint-disable @typescript-eslint/naming-convention */
export interface VariantEntityAttribute {
  type: string;
  value: string;
}
export interface VariantEntity {
  _id?: string;
  Category: string;
  additionalMedia?: string[];
  attributes: VariantEntityAttribute[];
  categoryId: string;
  country: string;
  embeddedVideos?: string[];
  extraImage1: string;
  extraImage2: string;
  extraImage3: string;
  extraImage4: string;
  extraImage5: string;
  extraImage6: string;
  howToUse: string;
  inStock: boolean;
  isExpired: boolean;
  prodID: string;
  prodPurchasePrice: number;
  productAvailability: string;
  productDescription: string;
  productName: string;
  productPicture: string;
  productPrice: number;
  productProfit: number;
  productQuantity: number;
  productWeight: number;
  sellerName: string;
  specifications: string;
  isPrimary?: boolean;
  orderCount: number;
  visibleToSellers: string[];
}
export interface VariantGroupEntity {
  _id?: string;
  Category: string;
  categoryId: string;
  name: string;
  country: string;
  internalCategoryId: string;
  variants: VariantEntity[];
  primaryVariant?: VariantEntity | string;
  attributeSets: {
    type: string;
    category: string;
    attributes: {
      name: string;
    }[];
  }[];
  visibleToSellers: string[];
  commercialCategoryIds: string[];
}
export interface PaginatedVariantGroupListEntity {
  counted: number;
  isLastPage: boolean;
  variantGroups: VariantGroupEntity[];
}
export interface CategoryEntity {
  _id: string;
  country: string;
  createdAt: string;
  featured: boolean;
  icon: string;
  name: string;
  sorting?: number;
  text: string;
  updatedAt: string;
}
export interface CategoryListEntity {
  data: CategoryEntity[];
  msg: string;
}
