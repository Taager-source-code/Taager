import { Mapper } from '../../../../core/base/mapper';
import { ShippingCompanyPriorityModel } from '../../../../core/domain/shippingCompany';
import { ShippingCompanyPriorityEntity } from '../entities/shipping-company-priority-entity';
export class ProvinceShippingCompanyPriorityRepositoryMapper extends
Mapper <ShippingCompanyPriorityEntity, ShippingCompanyPriorityModel> {
  mapFrom(param: ShippingCompanyPriorityEntity): ShippingCompanyPriorityModel {
    return {
       priorityId: param.priorityId,
    };
  }
  mapTo(param: ShippingCompanyPriorityModel): ShippingCompanyPriorityEntity {
    return {
        priorityId: param.priorityId,
     };
  }
}