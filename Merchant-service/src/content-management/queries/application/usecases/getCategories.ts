import { Service } from 'typedi';
import { Category } from '../../../common/infrastructure/db/models/categoryModel';
import CategoryRepo from '../../infrastructure/repositories/CategoryRepo';

@Service({ global: true })
export default class GetCategories {
  private categoryRepo: CategoryRepo;
  constructor(categoryRepo: CategoryRepo) {
    this.categoryRepo = categoryRepo;
  }

  async execute(getCategoriesRequest): Promise<Category[]> {
    const dbCategories = await this.categoryRepo.getCategoriesByCountry(getCategoriesRequest.country);

    // Doesn't make sense logically
    if (getCategoriesRequest.featured) {
      return dbCategories.filter(category => category.featured == true);
    } else {
      return dbCategories;
    }
  }
}


