export interface ShippingCompanyModel {
  name: string;
  companyId: string;
}
export interface ShippingCompanyPriorityModel {
  priorityId: string;
}
export interface ProvinceShippingCompanyPriorityUpdateModel {
  resetZones: boolean;
  priorities: ShippingCompanyPriorityModel[];
}
export interface ShippingCompanyCapacityModel {
  capacity: number;
  inTesting: boolean;
}
export interface ProvinceShippingCompanyModel {
  companyId?: string;
  capacityMode: string;
  capacity: number;
  cutOffTime: string;
}
export interface ProvinceShippingCompanyPriorityModel {
  companyName: string;
  capacity: number;
  capacityMode: string;
  remainingCapacity: number;
  cutOffTime: string;
  priorityId: string;
  inTesting?: boolean;
}
export interface ZoneShippingCompanyModel {
  provincePriorityId: string;
  capacity: number;
}
export interface ZoneShippingCompanyPriorityModel {
  companyName: string;
  capacity: number;
  capacityMode: string;
  remainingCapacity: number;
  inTesting: boolean;
  priorityId: string;
}
