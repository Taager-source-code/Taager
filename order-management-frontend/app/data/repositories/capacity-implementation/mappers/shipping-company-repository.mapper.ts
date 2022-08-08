import { Mapper } from '../../../../core/base/mapper';
import { ShippingCompanyModel } from '../../../../core/domain/shippingCompany';
import { ShippingCompanyEntity } from '../entities/shipping-company-entity';
export class ShippingCompanyRepositoryMapper extends Mapper<ShippingCompanyEntity, ShippingCompanyModel> {
    mapFrom(param: ShippingCompanyEntity): ShippingCompanyModel {
        return {
            name: param.name,
            companyId: param.companyId,
        };
    }
    mapTo(param: ShippingCompanyModel): ShippingCompanyEntity {
        return {
            name: param.name,
            companyId: param.companyId,
        };
    }
}