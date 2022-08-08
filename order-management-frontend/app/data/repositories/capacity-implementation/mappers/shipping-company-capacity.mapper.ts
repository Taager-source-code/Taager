import { Mapper } from '../../../../core/base/mapper';
import { ShippingCompanyCapacityModel } from '../../../../core/domain/shippingCompany';
import { ShippingCompanyCapacityEntity } from '../entities/shipping-company-capacity-entity';
export class ShippingCompanyCapacityRepositoryMapper
extends Mapper<ShippingCompanyCapacityEntity, ShippingCompanyCapacityModel> {
    mapFrom(param: ShippingCompanyCapacityEntity): ShippingCompanyCapacityModel {
        return {
           capacity: param.capacity,
           inTesting: param.inTesting,
        };
    }
    mapTo(param: ShippingCompanyCapacityModel): ShippingCompanyCapacityEntity {
        return {
            capacity: param.capacity,
            inTesting: param.inTesting,
        };
    }
}
