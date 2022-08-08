import { HierarchyCommercialCategory } from '../models/commercial-categories/HierarchyCommercialCategory';
import { CommercialCategory } from '../models/commercial-categories/CommercialCategory';

export default interface CommercialCategoryRepo {
  getDescendants(id: string): Promise<CommercialCategory[]>;
  getEntireHierarchy(country: string): Promise<HierarchyCommercialCategory[]>;
}


