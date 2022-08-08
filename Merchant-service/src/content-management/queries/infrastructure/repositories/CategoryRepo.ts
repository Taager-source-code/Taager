import { Service } from 'typedi';
import { Category } from '../../../common/infrastructure/db/models/categoryModel';
import CategoryDao from '../../../common/infrastructure/db/access/CategoryDao';
import { CategoryCache } from '../cache/categoryCache';
import Logger from '../../../../shared-kernel/infrastructure/logging/general.log';

@Service({ global: true })
export default class CategoryRepo {
  private categoryDao: CategoryDao;
  private categoryCache: CategoryCache;

  constructor(categoryDao: CategoryDao, categoryCache: CategoryCache) {
    this.categoryDao = categoryDao;
    this.categoryCache = categoryCache;
  }

  async getCategoriesByCountry(country: string): Promise<Category[]> {
    const cachedCategories = this.categoryCache.getByCountry(country);

    if (cachedCategories == null) {
      Logger.info('Retrieving categories from DB', { context: 'Category' }, country);

      const dbCategories = await this.categoryDao.getCategoriesByCountry(country);
      if (dbCategories) this.categoryCache.setByCountry(country, dbCategories);
      return dbCategories;
    }

    Logger.info('Retrieving categories from cache', { context: 'Category' }, country);
    return cachedCategories;
  }
}


