import { Service } from 'typedi';
import CommercialCategoryRepoImp from '../../infrastructure/repositories/CommercialCategoryRepoImpl';
import { HierarchyCommercialCategory } from '../models/commercial-categories/HierarchyCommercialCategory';

@Service({ global: true })
export default class GetCommercialCategoryHierarchy {
  private commercialCategoryRepo: CommercialCategoryRepoImp;

  constructor(commercialCategoriesRepo: CommercialCategoryRepoImp) {
    this.commercialCategoryRepo = commercialCategoriesRepo;
  }

  execute(country: string): Promise<HierarchyCommercialCategory[]> {
    return this.commercialCategoryRepo.getEntireHierarchy(country);
  }
}


