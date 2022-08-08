import { ProductModel } from './ProductModel';

export type VariantGroupAttributeSetAttribute = {
  name: string;
};

export type VariantGroupAttributeSet = {
  type: string;
  attributes: VariantGroupAttributeSetAttribute[];
};

export type VariantGroupModel = {
  variants: ProductModel[];
  country: string;
  primaryVariant?: ProductModel;
  attributeSets: VariantGroupAttributeSet[];
  name: string;
  categoryId?: string;
  commercialCategoryIds?: string[];
  visibleToSellers: string[];
  _id: string;
  updatedAt?: Date;
  createdAt?: Date;
};


