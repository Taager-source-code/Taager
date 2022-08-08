import { Mapper } from '../../../../core/base/mapper';
import { ZoneShippingCompanyPriorityModel } from '../../../../core/domain/shippingCompany';
import { ZoneShippingCompanyPriorityEntity } from '../entities/zone-sc-priority-entity';
export class ZoneShippingCompanyPriorityRepositoryMapper extends
    Mapper<ZoneShippingCompanyPriorityEntity, ZoneShippingCompanyPriorityModel> {
    mapFrom(param: ZoneShippingCompanyPriorityEntity): ZoneShippingCompanyPriorityModel {
        return {
            companyName: param.companyName,
            capacity: param.capacity,
            capacityMode: param.capacityMode,
            remainingCapacity: param.remainingCapacity,
            inTesting: param.inTesting,
            priorityId: param.zonePriorityId,
        };
    }
    mapTo(param: ZoneShippingCompanyPriorityModel): ZoneShippingCompanyPriorityEntity {
        return {
            companyName: param.companyName,
            capacity: param.capacity,
            capacityMode: param.capacityMode,
            remainingCapacity: param.remainingCapacity,
            inTesting: param.inTesting,
            zonePriorityId: param.priorityId,
        };
    }
}
