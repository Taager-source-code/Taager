import { VariantGroupAttributeSet } from './VariantGroup';

export declare type SearchVariantGroupsParameters = {
  pageSize: number;
  page: number;
  query: string;
  countable?: boolean;
  sortBy: string;
  category: string;
  commercialCategoryIds?: string[];
  country: string;
  userId: string;
};

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


