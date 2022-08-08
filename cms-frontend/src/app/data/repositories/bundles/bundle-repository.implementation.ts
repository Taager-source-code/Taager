/* eslint-disable @typescript-eslint/naming-convention */
import { Mapper } from '@core/base/mapper';
import { BundleGroupModel } from '@core/domain/bundles/bundle.model';
import { BundleGroupEntity } from '../entities/bundle.entity';
import { BundleRepositoryMapper } from './bundle-repository.mapper';
export class BundleGroupRepositoryMapper extends Mapper<BundleGroupEntity, BundleGroupModel>{
  mapFrom(param: BundleGroupEntity): BundleGroupModel {
    const bundleRepositoryMapperInstance = new BundleRepositoryMapper();
    const primaryVariant = typeof (param.primaryVariant) !== 'string' ?
    bundleRepositoryMapperInstance.mapFrom(param.primaryVariant) :
    bundleRepositoryMapperInstance
        .mapFrom(param.variants.filter(variant => variant._id === param.primaryVariant)[0]);
    return {
      _id: param._id,
      categoryId: param.categoryId,
      name: param.name,
      country: param.country,
      attributeSets: param.attributeSets,
      internalCategoryId: param.internalCategoryId,
      primaryVariant,
      primaryVariantId: typeof (param.primaryVariant) === 'string' ? param.primaryVariant : param.primaryVariant._id,
      variants: param.variants?.map(bundleRepositoryMapperInstance.mapFrom),
      visibleToSellers: param.visibleToSellers,
      commercialCategoryIds: param.commercialCategoryIds,
    };
  }
  mapTo(param: BundleGroupModel): BundleGroupEntity {
    const bundleRepositoryMapperInstance = new BundleRepositoryMapper();
    return {
      _id: param._id,
      categoryId: param.categoryId,
      name: param.name,
      country: param.country,
      internalCategoryId: param.internalCategoryId,
      variants: param.variants.map(bundleRepositoryMapperInstance.mapTo),
      attributeSets: param.attributeSets,
      visibleToSellers: param.visibleToSellers,
      commercialCategoryIds: param.commercialCategoryIds,
    };
  }
}
