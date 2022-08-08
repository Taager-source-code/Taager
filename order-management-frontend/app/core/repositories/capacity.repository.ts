import { Observable } from 'rxjs';
import { ProvinceCapacityModel } from '../domain/capacity.model';
import { ProvinceZoneModel } from '../domain/province.model';
import {
  ProvinceShippingCompanyModel,
  ProvinceShippingCompanyPriorityModel,
  ProvinceShippingCompanyPriorityUpdateModel,
  ShippingCompanyCapacityModel,
  ShippingCompanyModel,
  ShippingCompanyPriorityModel,
  ZoneShippingCompanyModel,
  ZoneShippingCompanyPriorityModel } from '../domain/shippingCompany';
export abstract class ShippingCapacityRepository {
    abstract getProvinceCapacity(): Observable<ProvinceCapacityModel[]>;
    abstract getZonesInProvince(provinceId: string): Observable<ProvinceZoneModel[]>;
    abstract getProvinceShippingCompaniesPriorities
    (provinceId: string):
    Observable<ProvinceShippingCompanyPriorityModel[]>;
    abstract getZoneShippingCompaniesPriorities
    (params: {provinceId: string; zoneId: string}):
    Observable<ZoneShippingCompanyPriorityModel[]>;
    abstract getShippingCompanies(): Observable<ShippingCompanyModel[]>;
    abstract createProvinceShippingCompany(
      params: {provinceId: string; data: ProvinceShippingCompanyModel}
    ): Observable<void>;
    abstract updateProvinceShippingCompany(
      params: {provinceId: string; priorityId: string; data: ProvinceShippingCompanyModel}
    ): Observable<void>;
    abstract createZoneShippingCompany(
      params: {provinceId: string; zoneId: string; data: ZoneShippingCompanyModel}
    ): Observable<void>;
    abstract updateZoneShippingCompany(
      params: {provinceId: string; zoneId: string; priorityId: string; data: ShippingCompanyCapacityModel}
    );
    abstract deleteProvinceShippingCompanyPriority(
      params: {provinceId: string; priorityId: string}
    ): Observable<void>;
    abstract deleteZoneShippingCompanyPriority(
      params: {provinceId: string; zoneId: string; priorityId: string}
    ): Observable<void>;
    abstract updateProvinceShippingCompanyPriority(
      params: {provinceId: string; data: ProvinceShippingCompanyPriorityUpdateModel}
    ): Observable<void>;
    abstract updateZoneShippingCompanyPriority(
      params: {provinceId: string; zoneId: string; data: ShippingCompanyPriorityModel[]}
    ): Observable<void>;
  }
