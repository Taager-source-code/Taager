export type CommercialCategoryWithChildren = {
  categoryId: string;
  englishName: string;
  arabicName: string;
  featured?: boolean;
  sorting?: number;
  icon?: string;
  ancestors: string[];
  children: CommercialCategoryWithChildren[];
};


