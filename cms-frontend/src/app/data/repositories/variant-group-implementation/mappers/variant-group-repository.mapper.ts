/* eslint-disable @typescript-eslint/naming-convention */
import { Mapper } from '@core/base/mapper';
import { VariantGroupModel } from '@core/domain/variant-group.model';
import { VariantGroupEntity } from '../entities/variant-group-entity';
import { VariantRepositoryMapper } from './variant-repository.mapper';
export class VariantGroupRepositoryMapper extends Mapper<VariantGroupEntity, VariantGroupModel>{
  mapFrom(param: VariantGroupEntity): VariantGroupModel {
    const VariantRepositoryMapperInstance = new VariantRepositoryMapper();
    return {
      _id: param._id,
      categoryName: param.Category,
      categoryId: param.categoryId,
      productName: param.name,
      country: param.country,
      attributeSets: param.attributeSets,
      internalCategoryId: param.internalCategoryId,
      primaryVariant: typeof (param.primaryVariant) !== 'string' ?
        VariantRepositoryMapperInstance.mapFrom(param.primaryVariant) :
        VariantRepositoryMapperInstance
          .mapFrom(param.variants.filter(variant => variant._id === param.primaryVariant)[0]),
      primaryVariantId: typeof (param.primaryVariant) === 'string' ? param.primaryVariant : param.primaryVariant._id,
      variants: param.variants?.map(VariantRepositoryMapperInstance.mapFrom),
      visibleToSellers: param.visibleToSellers,
      commercialCategoryIds: param.commercialCategoryIds,
    };
  }
  mapTo(param: VariantGroupModel): VariantGroupEntity {
    const VariantRepositoryMapperInstance = new VariantRepositoryMapper();
    return {
      _id: param._id,
      Category: param.categoryName,
      categoryId: param.categoryId,
      name: param.productName,
      country: param.country,
      internalCategoryId: param.internalCategoryId,
      variants: param.variants.map(VariantRepositoryMapperInstance.mapTo),
      attributeSets: param.attributeSets,
      visibleToSellers: param.visibleToSellers,
      commercialCategoryIds: param.commercialCategoryIds,
    };
  }
}
