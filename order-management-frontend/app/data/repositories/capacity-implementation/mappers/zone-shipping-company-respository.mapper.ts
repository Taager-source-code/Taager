import { Mapper } from '../../../../core/base/mapper';
import { ZoneShippingCompanyModel } from '../../../../core/domain/shippingCompany';
import { ZoneShippingCompanyEntity } from '../entities/zone-shipping-company-entity';
export class ZoneShippingCompanyRepositoryMapper extends
Mapper <ZoneShippingCompanyEntity, ZoneShippingCompanyModel> {
  mapFrom(param: ZoneShippingCompanyEntity): ZoneShippingCompanyModel {
    return {
      provincePriorityId: param.provincePriorityId,
      capacity: param.capacity,
    };
  }
  mapTo(param: ZoneShippingCompanyModel): ZoneShippingCompanyEntity {
    return {
    provincePriorityId: param.provincePriorityId,
    capacity: param.capacity,
    };
  }
}