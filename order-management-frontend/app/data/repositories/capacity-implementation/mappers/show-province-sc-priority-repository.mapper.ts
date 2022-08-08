import { Mapper } from '../../../../core/base/mapper';
import { ProvinceShippingCompanyPriorityModel } from '../../../../core/domain/shippingCompany';
import { ProvinceShippingCompanyPriorityEntity } from '../entities/province-sc-priority-entity';
export class ShowProvinceShippingCompanyPriorityRepositoryMapper extends
Mapper <ProvinceShippingCompanyPriorityEntity, ProvinceShippingCompanyPriorityModel> {
  mapFrom(param: ProvinceShippingCompanyPriorityEntity): ProvinceShippingCompanyPriorityModel {
    return {
      companyName: param.companyName,
      capacity: param.capacity,
      capacityMode: param.capacityMode,
      cutOffTime: param.cutOffTime,
      remainingCapacity: param.remainingCapacity,
      priorityId: param.provincePriorityId,
    };
  }
  mapTo(param: ProvinceShippingCompanyPriorityModel): ProvinceShippingCompanyPriorityEntity {
    return {
        companyName: param.companyName,
        capacity: param.capacity,
        capacityMode: param.capacityMode,
        cutOffTime: param.cutOffTime,
        remainingCapacity: param.remainingCapacity,
        provincePriorityId: param.priorityId,
     };
  }
}