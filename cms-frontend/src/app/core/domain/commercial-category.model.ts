export interface BaseCategoryModel {
  id?: string;
  name: CommercialCategoryName;
}
export interface CommercialCategoryModel extends BaseCategoryModel {
  featured: boolean;
  country: string;
  sorting: number;
}
export interface CommercialCategoryName {
  englishName: string;
  arabicName: string;
}
export interface CommercialSubCategoryModel extends BaseCategoryModel {
  parentCategoryId: string;
  ancestors?: BaseCategoryModel[];
}
