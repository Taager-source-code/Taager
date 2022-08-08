import { Mapper } from '../../../../core/base/mapper';
import { ProvinceShippingCompanyModel } from '../../../../core/domain/shippingCompany';
import { ProvinceShippingCompanyEntity } from '../entities/province-shipping-company-entity';
export class ProvinceShippingCompanyRepositoryMapper extends
Mapper <ProvinceShippingCompanyEntity, ProvinceShippingCompanyModel> {
  mapFrom(param: ProvinceShippingCompanyEntity): ProvinceShippingCompanyModel {
    return {
       companyId: param.companyId,
       capacityMode: param.capacityMode,
       capacity: param.capacity,
       cutOffTime: param.cutOffTime,
    };
  }
  mapTo(param: ProvinceShippingCompanyModel): ProvinceShippingCompanyEntity {
    return {
       companyId: param.companyId,
       capacityMode: param.capacityMode,
       capacity: param.capacity,
       cutOffTime: param.cutOffTime,
    };
  }
}
