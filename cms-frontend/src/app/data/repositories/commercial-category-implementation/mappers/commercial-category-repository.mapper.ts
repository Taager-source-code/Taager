import { Mapper } from '@core/base/mapper';
import { CommercialCategoryModel } from '@core/domain/commercial-category.model';
import { CommercialCategoryEntity } from '../entities/commercial-category-entity';
export class CommercialCategoryRepositoryMapper extends Mapper <CommercialCategoryEntity, CommercialCategoryModel> {
  mapFrom(param: CommercialCategoryEntity): CommercialCategoryModel {
    return {
      id: param.categoryId,
      name: {
        arabicName: param.arabicName,
        englishName: param.englishName,
      },
      featured: param.featured,
      country: param.country,
      sorting: param.sorting,
    };
  }
  mapTo(param: CommercialCategoryModel): CommercialCategoryEntity {
    return {
      categoryId: param.id,
      arabicName: param.name.arabicName,
      englishName: param.name.englishName,
      featured: param.featured,
      country: param.country,
      sorting: param.sorting,
    };
  }
}