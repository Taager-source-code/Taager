import Category from '../../../common/infrastructure/db/schemas/category.model';

export const countCategories = query => Category.countDocuments(query).exec();

export const findAllCategories = query =>
  Category.find(query)
    .sort({ sorting: 1 })
    .exec();


