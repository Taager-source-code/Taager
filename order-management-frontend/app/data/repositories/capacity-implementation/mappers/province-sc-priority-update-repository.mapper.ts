import { Mapper } from '../../../../core/base/mapper';
import { ProvinceShippingCompanyPriorityUpdateModel } from '../../../../core/domain/shippingCompany';
import { ProvinceShippingCompanyPriorityUpdateEntity } from '../entities/province-sc-priority-update.entity';
export class ProvinceShippingCompanyUpdateRepositoryMapper extends
Mapper <ProvinceShippingCompanyPriorityUpdateEntity, ProvinceShippingCompanyPriorityUpdateModel> {
  mapFrom(param: ProvinceShippingCompanyPriorityUpdateEntity): ProvinceShippingCompanyPriorityUpdateModel {
    return {
      resetZones: param.resetZones,
      priorities: param.priorities,
    };
  }
  mapTo(param: ProvinceShippingCompanyPriorityUpdateModel): ProvinceShippingCompanyPriorityUpdateEntity {
    return {
        resetZones: param.resetZones,
        priorities: param.priorities,
    };
  }
}
