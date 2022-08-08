import { Service } from 'typedi';
import CommercialCategoryDao from '../../../common/infrastructure/db/access/CommercialCategoryDao';
import CommercialCategoryRepo from '../../application/contracts/CommercialCategoryRepo';
import { CommercialCategoryModel } from '../../../common/infrastructure/db/models/CommercialCategoryModel';
import { CommercialCategoryWithChildren } from '../../application/models/commercial-categories/CommercialCategoryWithChildren';
import { HierarchyCommercialCategory } from '../../application/models/commercial-categories/HierarchyCommercialCategory';

@Service({ global: true })
export default class CommercialCategoryRepoImpl implements CommercialCategoryRepo {
  private commercialCategoryDao: CommercialCategoryDao;

  constructor(commercialCategoryDao: CommercialCategoryDao) {
    this.commercialCategoryDao = commercialCategoryDao;
  }

  getDescendants(id: string): Promise<CommercialCategoryModel[]> {
    return this.commercialCategoryDao.getDescendants(id);
  }

  async getEntireHierarchy(country: string): Promise<HierarchyCommercialCategory[]> {
    const categories = await this.commercialCategoryDao.getAll(country);
    const hierarchy = await this.prepopulateHierarchy(categories);

    const roots: any[] = [];

    for (const category of categories) {
      const hierarchyCategory = hierarchy.get(category.categoryId);
      if (hierarchyCategory) {
        if (this.isRoot(hierarchyCategory)) {
          this.appendRoot(hierarchyCategory, roots);
        } else {
          this.appendChild(hierarchyCategory, hierarchy);
        }
      }
    }

    this.removeAncestorsFromHierarchy(categories, hierarchy);

    return roots;
  }

  private async prepopulateHierarchy(
    categories: CommercialCategoryModel[],
  ): Promise<Map<string, CommercialCategoryWithChildren>> {
    const hierarchy = new Map<string, any>();
    for (const category of categories) {
      const categoryWithChildren = {
        categoryId: category.categoryId,
        englishName: category.englishName,
        arabicName: category.arabicName,
        featured: category.featured,
        sorting: category.sorting,
        ancestors: category.ancestors,
        icon: category.icon,
        children: [],
      };
      hierarchy.set(category.categoryId, categoryWithChildren);
    }
    return hierarchy;
  }

  private appendRoot(category: CommercialCategoryWithChildren, roots: CommercialCategoryWithChildren[]) {
    roots.push(category);
  }

  private appendChild(
    category: CommercialCategoryWithChildren,
    hierarchy: Map<string, CommercialCategoryWithChildren>,
  ) {
    const parentId = category.ancestors[category.ancestors.length - 1];
    const parent = hierarchy.get(parentId);
    if (parent) {
      parent.children.push(category);
    }
  }

  private isRoot(category: CommercialCategoryWithChildren) {
    return category.ancestors.length === 0;
  }

  private removeAncestorsFromHierarchy(
    categories: CommercialCategoryModel[],
    hierarchy: Map<string, CommercialCategoryWithChildren>,
  ) {
    for (const category of categories) {
      const hierarchyCategory: any = hierarchy.get(category.categoryId);
      delete hierarchyCategory.ancestors;
    }
  }
}


