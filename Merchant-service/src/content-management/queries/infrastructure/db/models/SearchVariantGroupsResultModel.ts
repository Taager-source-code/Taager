import { VariantGroupAttributeSet } from './VariantGroupModel';

export declare type SearchVariantGroupsResult = {
  results: SearchedVariantGroup[];
  count?: number;
};

export declare type SearchedVariantGroup = {
  _id: string;
  variants: any[];
  primaryVariant: any;
  attributeSets: VariantGroupAttributeSet[];
  country: string;
  category: any[];
};


