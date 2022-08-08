export type HierarchyCommercialCategory = {
  categoryId: string;
  englishName: string;
  arabicName: string;
  featured?: boolean;
  sorting?: number;
  children: HierarchyCommercialCategory[];
};


