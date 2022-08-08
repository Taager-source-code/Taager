import { Mapper } from '../../../../core/base/mapper';
import { InternalCategoryModel } from '../../../../core/domain/internal-category.model';
import { InternalCategoryEntity } from '../entities/internal-category-entity';
export class InternalCategoryRepositoryMapper extends Mapper <InternalCategoryEntity, InternalCategoryModel> {
  mapFrom(param: InternalCategoryEntity): InternalCategoryModel {
    return {
      id: param.categoryId,
      name: {
        arabicName: param.arabicName,
        englishName: param.englishName,
      },
    };
  }
  mapTo(param: InternalCategoryModel): InternalCategoryEntity {
    return {
      categoryId: param.id,
      arabicName: param.name.arabicName,
      englishName: param.name.englishName,
    };
  };
}
