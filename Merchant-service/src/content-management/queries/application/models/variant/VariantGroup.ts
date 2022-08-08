export type VariantGroup = {
  variants: any[];
  country: string;
  primaryVariant?: any;
  attributeSets: VariantGroupAttributeSet[];
  name: string;
  categoryId?: string;
  visibleToSellers: string[];
  _id: string;
  updatedAt?: Date;
  createdAt?: Date;
};

export type VariantGroupAttributeSet = {
  type: string;
  attributes: VariantGroupAttributeSetAttribute[];
};

export type VariantGroupAttributeSetAttribute = {
  name: string;
};


