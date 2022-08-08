export type CommercialCategoryModel = {
  _id?: string;
  categoryId: string;
  englishName: string;
  arabicName: string;
  country: string;
  featured?: boolean;
  sorting?: number;
  icon?: string;
  ancestors: string[];
  updatedAt?: Date;
  createdAt?: Date;
};


