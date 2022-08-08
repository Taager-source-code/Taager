import { Mapper } from '../../../../core/base/mapper';
import { InternalSubCategoryModel } from '../../../../core/domain/internal-category.model';
import { InternalSubCategoryEntity } from '../entities/internal-category-entity';
export class InternalSubCategoryRepositoryMapper
  extends Mapper <InternalSubCategoryEntity, InternalSubCategoryModel> {
  mapFrom(param: InternalSubCategoryEntity): InternalSubCategoryModel {
    return {
      id: param.categoryId,
      name: {
        arabicName: param.arabicName,
        englishName: param.englishName,
      },
      parentCategoryId: param.parentId,
      ancestors: param.ancestors,
    };
  }
  mapTo(param: InternalSubCategoryModel): InternalSubCategoryEntity {
    return {
      categoryId: param.id,
      englishName: param.name.englishName,
      arabicName: param.name.arabicName,
      parentId: param.parentCategoryId,
      ancestors: param.ancestors,
    };
  }
}
