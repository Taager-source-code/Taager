import VariantGroupDao from '../db/access/VariantGroupDao';
import { VariantGroupCache } from '../cache/VariantGroupCache';
import { Service } from 'typedi';
import {
  SearchVariantGroupsParameters,
  SearchVariantGroupsResult,
} from '../../application/models/variant/SearchVariantGroupsResult';
import { VariantGroup } from '../../application/models/variant/VariantGroup';
import VariantRepo from '../../application/contracts/VariantRepo';

@Service({ global: true })
export default class VariantRepoImpl implements VariantRepo {
  private variantDao: VariantGroupDao;
  private variantCache: VariantGroupCache;

  constructor(variantDao: VariantGroupDao, variantCache: VariantGroupCache) {
    this.variantCache = variantCache;
    this.variantDao = variantDao;
  }

  async getVariantGroup(id): Promise<VariantGroup | null> {
    return this.variantDao.getVariantGroup(id);
  }

  async getVariantGroupByVariantId(variantId): Promise<VariantGroup | null> {
    return this.variantDao.getByVariantId(variantId);
  }

  async search(searchQuery: SearchVariantGroupsParameters): Promise<SearchVariantGroupsResult> {
    const cachedValue = this.variantCache.get(searchQuery);
    if (cachedValue) {
      return cachedValue;
    }
    const daoValue = await this.variantDao.search(searchQuery);
    this.variantCache.set(searchQuery, daoValue);
    return daoValue;
  }

  async optimizedSearch(query: SearchVariantGroupsParameters): Promise<SearchVariantGroupsResult> {
    return this.variantDao.optimizedSearch(query);
  }
}


