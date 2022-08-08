export interface BaseCommercialCategoryEntity {
  categoryId:	string;
  englishName:	string;
  arabicName:	string;
}
export interface CommercialCategoryEntity extends BaseCommercialCategoryEntity {
  featured: boolean;
  country:	string;
  sorting: number;
}
export interface CommercialSubCategoryEntity extends BaseCommercialCategoryEntity {
  parentId?: string;
  ancestors?: BaseCommercialCategoryEntity[];
}