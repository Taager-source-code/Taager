export interface VariantAttribute {
  type: string;
  value: string;
}
export interface VariantModel {
  _id?: string;
  productId: string;
  productName: string;
  country: string;
  price: number;
  purchasePrice: number;
  profit: number;
  variantImages: string[];
  videosLinks: string[];
  description: string;
  specifications: string;
  inStock: boolean;
  howToUse?: string;
  attributes?: VariantAttribute[];
  isExpired: boolean;
  quantity?: number;
  weight?: number;
  sellerName?: string;
  productAvailability: string;
  categoryName: string;
  categoryId: string;
  isPrimary?: boolean;
  isDisabled: boolean;
  orderCount?: number;
  visibleToSellers: string[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Category?: string;
}
export interface VariantGroupModel {
  _id?: string;
  categoryName: string;
  categoryId: string;
  productName: string;
  country: string;
  variants: VariantModel[];
  primaryVariant?: VariantModel;
  primaryVariantId?: string;
  visibleToSellers: string[];
  attributeSets: AttributeSet[];
  internalCategoryId: string;
  commercialCategoryIds: string[];
}
export interface AttributeSet {
  type: string;
  category: string;
  attributes: {
    name: string;
  }[];
}
export interface VariantGroupFilterModel {
  page: number;
  pageSize: number;
  filter: {
    productId?: string;
    country: string;
    categoryName?: string;
    productAvailability?: string;
  };
}
export interface PaginatedVariantGroupList {
  allProductsCount: number;
  isLastPage: boolean;
  variantGroups: VariantGroupModel[];
}
export interface CategoryFilterModel {
  filter: {
    country?: string;
  };
}
export interface CategoryModel {
  _id: string;
  country: string;
  featured: boolean;
  name: {
    arName: string;
    enName: string;
  };
  icon: string;
  createdAt: string;
  updatedAt: string;
}
