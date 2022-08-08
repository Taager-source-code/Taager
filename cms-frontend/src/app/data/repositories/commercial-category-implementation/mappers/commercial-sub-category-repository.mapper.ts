import { Mapper } from '@core/base/mapper';
import { CommercialSubCategoryModel } from '@core/domain/commercial-category.model';
import { CommercialSubCategoryEntity } from '../entities/commercial-category-entity';
export class CommercialSubCategoryRepositoryMapper
  extends Mapper <CommercialSubCategoryEntity, CommercialSubCategoryModel> {
    mapFrom(param: CommercialSubCategoryEntity): CommercialSubCategoryModel {
      return {
        id: param.categoryId,
        name: {
          arabicName: param.arabicName,
          englishName: param.englishName,
        },
        parentCategoryId: param.parentId,
        ancestors: param.ancestors?.map(ancestor => ({
          id: ancestor.categoryId,
          name: {
            arabicName: ancestor.arabicName,
            englishName: ancestor.englishName,
          },
        })) ?? [],
      };
    }
    mapTo(param: CommercialSubCategoryModel): CommercialSubCategoryEntity {
      return {
        categoryId: param.id,
        arabicName: param.name.arabicName,
        englishName: param.name.englishName,
        parentId: param.parentCategoryId,
      };
    }
}
