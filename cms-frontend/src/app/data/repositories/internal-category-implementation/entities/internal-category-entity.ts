export interface InternalCategoryEntity {
  categoryId?: string;
  englishName: string;
  arabicName: string;
};
export interface InternalSubCategoryEntity extends InternalCategoryEntity {
  parentId?: string;
  ancestors?: { categoryId: string }[];
};
