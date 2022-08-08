import { Service } from 'typedi';
import { CommercialCategoryModel } from '../models/CommercialCategoryModel';
import CommercialCategorySchema from '../schemas/CommercialCategorySchema';

@Service({ global: true })
export default class CommercialCategoryDao {
  getAll(country: string): Promise<CommercialCategoryModel[]> {
    return CommercialCategorySchema.find({ country })
      .lean()
      .exec();
  }
  getDescendants(id: string): Promise<CommercialCategoryModel[]> {
    return CommercialCategorySchema.find({
      ancestors: id,
    }).exec();
  }
}


