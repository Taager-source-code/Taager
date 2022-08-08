import { Service } from 'typedi';
import { Category } from '../models/categoryModel';
import CategoryModel from '../schemas/category.model';

@Service({ global: true })
export default class CategoryDao {
  getCategoriesByCountry(country: string): Promise<Category[]> {
    return CategoryModel.find({ country: country }).exec();
  }
}


