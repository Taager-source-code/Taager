import { ProvinceShippingCompanyPriorityModel, ShippingCompanyModel } from '../../core/domain/shippingCompany';
export interface ProvinceChangeArgs {
    value: string;
    itemData: ShippingCompanyModel;
}
export interface ChangeEventArgs {
    value: string;
    text: string;
}
export interface ShippingCompanyPriorityModelEvent extends ProvinceShippingCompanyPriorityModel {
    capacityValue: number;
    inTesting: boolean;
}
