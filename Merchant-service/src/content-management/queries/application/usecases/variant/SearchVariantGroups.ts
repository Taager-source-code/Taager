import VariantRepo from '../../contracts/VariantRepo';
import { Inject, Service } from 'typedi';
import {
  SearchVariantGroupsParameters,
  SearchVariantGroupsResult,
} from '../../models/variant/SearchVariantGroupsResult';
import VariantRepoImpl from '../../../infrastructure/repositories/VariantRepoImpl';
import CommercialCategoryRepo from '../../contracts/CommercialCategoryRepo';
import CommercialCategoryRepoImpl from '../../../infrastructure/repositories/CommercialCategoryRepoImpl';
import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import _ from 'lodash';

@Service({ global: true })
export default class SearchVariantGroups {
  private variantRepo: VariantRepo;
  private commercialCategoryRepo: CommercialCategoryRepo;

  constructor(
    @Inject(() => VariantRepoImpl) variantRepo: VariantRepo,
    @Inject(() => CommercialCategoryRepoImpl) commercialCategoryRepo: CommercialCategoryRepo,
  ) {
    this.variantRepo = variantRepo;
    this.commercialCategoryRepo = commercialCategoryRepo;
  }

  private async getCommercialCategoryHierarchyIds(categoryId): Promise<string[]> {
    let commercialCategoryIds: string[] = [];
    if (categoryId) {
      const descendantCategories = await this.commercialCategoryRepo.getDescendants(categoryId);
      commercialCategoryIds = [categoryId, ...descendantCategories.map(category => category.categoryId)];
    }
    return commercialCategoryIds;
  }

  async execute(searchQuery: SearchVariantGroupsParameters): Promise<SearchVariantGroupsResult> {
    if (searchQuery.commercialCategoryIds && searchQuery.commercialCategoryIds.length > 0) {
      searchQuery.commercialCategoryIds = await this.getCommercialCategoryHierarchyIds(
        searchQuery.commercialCategoryIds[0],
      );
    }
    const optimizedSearchResults = await this.variantRepo.optimizedSearch(searchQuery);
    const searchResults = await this.variantRepo.search(searchQuery);

    //_ids in variants are always different, we need to omit them from comparison
    const searchResultsComparison = searchResults.results.map(res => {
      return { ...res, variants: res.variants.map(v => _.omit(v, '_id')) };
    });

    const optimizedSearchResultsComparison = optimizedSearchResults.results.map(res => {
      return { ...res, variants: res.variants.map(v => _.omit(v, '_id')) };
    });

    if (!_.isEqual(searchResultsComparison, optimizedSearchResultsComparison)) {
      const expectedIds = searchResults.results.map(result => result._id).toString();
      const actualIds = optimizedSearchResults.results.map(result => result._id).toString();
      Logger.warn(
        `
        Mismatch in the search results detected. 
        Old search fetched the following ids: ${expectedIds}. 
        New search fetched the following ids: ${actualIds}. Query used: ${JSON.stringify(searchQuery)}. 
        Mismatch can either be in the number of fetched variant groups or the difference in the fetched models/attributes.`,
        { domain: 'cms' },
      );
    } else {
      Logger.info('Old and new search results are matching.', { domain: 'cms' });
    }

    return searchResults;
  }
}


