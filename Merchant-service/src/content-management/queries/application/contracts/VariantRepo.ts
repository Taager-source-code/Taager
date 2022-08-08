import { VariantGroup } from '../models/variant/VariantGroup';
import { SearchVariantGroupsParameters, SearchVariantGroupsResult } from '../models/variant/SearchVariantGroupsResult';

export default interface VariantRepo {
  getVariantGroup(id): Promise<VariantGroup | null>;

  getVariantGroupByVariantId(variantId): Promise<VariantGroup | null>;

  search(searchQuery: SearchVariantGroupsParameters): Promise<SearchVariantGroupsResult>;

  optimizedSearch(query: SearchVariantGroupsParameters): Promise<SearchVariantGroupsResult>;
}


