import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GetProvinceCapacityUseCase } from '../core/usecases/capacity-module/get-province-capacity.usecase';
import { ShippingCapacityRepository } from '../core/repositories/capacity.repository';
import { GetZonesInProvinceUseCase } from '../core/usecases/capacity-module/get-zones-in-province.usecase';
import
{ GetProvinceShippingCompanyPrioritiesUseCase }
from '../core/usecases/capacity-module/get-province-sc-priorities.usecase';
import
{ GetZoneShippingCompanyPrioritiesUseCase }
from '../core/usecases/capacity-module/get-zone-sc-priorities';
import
{ ShippingCapacityRepositoryImplementation }
from './repositories/capacity-implementation/shipping-capacity-impl.repository';
import { GetShippingCompaniesUseCase } from '../core/usecases/capacity-module/get-shipping-companies.usecase';
import
{ CreateProvinceShippingCompanyUseCase }
from '../core/usecases/capacity-module/create-province-shipping-company.usecase';
import { CreateZoneShippingCompanyUseCase }
from '../core/usecases/capacity-module/create-zone-shipping-company.usecase';
import {
  DeleteProvinceShippingCompanyPriorityUseCase,
} from '../core/usecases/capacity-module/delete-province-sc-priority.usecase';
import {
  DeleteZoneShippingCompanyPriorityUseCase,
} from '../core/usecases/capacity-module/delete-zone-sc-priority.usecase';
import {
  UpdateProvinceShippingCompanyUseCase,
} from '../core/usecases/capacity-module/update-province-shipping-company.usecase';
import {
  UpdateZoneShippingCompanyUseCase,
} from '../core/usecases/capacity-module/update-zone-shipping-company.usecase';
import {
  UpdateProvinceShippingCompanyPriorityUseCase,
} from '../core/usecases/capacity-module/update-province-sc-priority.usecase';
import {
  UpdateZoneShippingCompanyPriorityUseCase,
} from '../core/usecases/capacity-module/update-zone-sc-priority.usecase';
import { AllocationServiceRepository } from '../core/repositories/allocationService.repository';
import {
  GetAllocationServiceStatusUseCase,
} from '../core/usecases/allocation-service/get-allocation-service-status.usecase';
import {
  UpdateAllocationServiceStatusUseCase,
} from '../core/usecases/allocation-service/update-allocation-service-status.usecase';
import {
  RunAllocationServicesUseCase,
} from '../core/usecases/allocation-service/run-allocation-service.usecase';
import { UnAllocationServiceRepository } from '../core/repositories/unAllocationService.repository';
import { UnAllocationServiceRepositoryImplementation }
from './repositories/unallocation-implementation/unallocation-service-impl.repository';
import { UpdateUnAllocationServiceStatusUseCase } from '../core/usecases/unAllocation-service/upload-orders.usecase';
import { OrderRepository } from '../core/repositories/order.repository';
import { GetOrdersListUseCase } from '../core/usecases/order-module/get-orders-list.usecase';
import { OrderRepositoryImplementation } from './repositories/order-implementation/order-list-impl.repository';
import { AllocationServiceRepositoryImplementation }
from './repositories/allocation-service-implementation/allocation-service-impl.repository';
import { CountryRepository } from '@core/repositories/country.repository';
import { GetCountriesUseCase } from '@core/usecases/country/get-countries.usecase';
import { CountryRepositoryImpl } from './repositories/country-implementation/country-impl.repository';
import { EventTrackingRepository } from '@core/repositories/event-tracking.repository';
import { TrackEventUseCase } from '@core/usecases/event-tracking/track-event.usecase';
import {
  EventTrackingRepositoryImpl,
} from '@data/repositories/event-tracking-implementation/event-tracking-impl.repository';
import { GetOrderDetailUseCase } from '@core/usecases/order-module/get-order-detail.usecase';
import { ProvinceRepository } from '@core/repositories/province.repository';
import { GetProvincesUseCase } from '@core/usecases/province/get-provinces.usecase';
import { ProvinceRepositoryImplementation } from './repositories/province-implementation.ts/province-impl.repository';


const createProvinceShippingCompanyUseCaseFactory =
  (shippingCompanyPriorityRepo: ShippingCapacityRepository) =>
  new CreateProvinceShippingCompanyUseCase(shippingCompanyPriorityRepo);
export const createProvinceShippingCompanyUseCaseProvider = {
  provide: CreateProvinceShippingCompanyUseCase,
  useFactory: createProvinceShippingCompanyUseCaseFactory,
  deps: [ShippingCapacityRepository],
};

const updateProvinceShippingCompanyUseCaseFactory =
  (shippingCompanyPriorityRepo: ShippingCapacityRepository) =>
  new UpdateProvinceShippingCompanyUseCase(shippingCompanyPriorityRepo);
export const updateProvinceShippingCompanyUseCaseProvider = {
  provide: UpdateProvinceShippingCompanyUseCase,
  useFactory: updateProvinceShippingCompanyUseCaseFactory,
  deps: [ShippingCapacityRepository],
};

const createZoneShippingCompanyUseCaseFactory =
  (shippingCompanyPriorityRepo: ShippingCapacityRepository) =>
  new CreateZoneShippingCompanyUseCase(shippingCompanyPriorityRepo);
export const createZoneShippingCompanyUseCaseProvider = {
  provide: CreateZoneShippingCompanyUseCase,
  useFactory: createZoneShippingCompanyUseCaseFactory,
  deps: [ShippingCapacityRepository],
};

const updateZoneShippingCompanyUseCaseFactory =
  (shippingCompanyPriorityRepo: ShippingCapacityRepository) =>
  new UpdateZoneShippingCompanyUseCase(shippingCompanyPriorityRepo);
export const updateZoneShippingCompanyUseCaseProvider = {
  provide: UpdateZoneShippingCompanyUseCase,
  useFactory: updateZoneShippingCompanyUseCaseFactory,
  deps: [ShippingCapacityRepository],
};

const updateProvinceShippingCompanyPriorityUseCaseFactory =
  (shippingCompanyPriorityRepo: ShippingCapacityRepository) =>
  new UpdateProvinceShippingCompanyPriorityUseCase(shippingCompanyPriorityRepo);
export const updateProvinceShippingCompanyPriorityUseCaseProvider = {
  provide: UpdateProvinceShippingCompanyPriorityUseCase,
  useFactory: updateProvinceShippingCompanyPriorityUseCaseFactory,
  deps: [ShippingCapacityRepository],
};

const updateZoneShippingCompanyPriorityUseCaseFactory =
  (shippingCompanyPriorityRepo: ShippingCapacityRepository) =>
  new UpdateZoneShippingCompanyPriorityUseCase(shippingCompanyPriorityRepo);
export const updateZoneShippingCompanyPriorityUseCaseProvider = {
  provide: UpdateZoneShippingCompanyPriorityUseCase,
  useFactory: updateZoneShippingCompanyPriorityUseCaseFactory,
  deps: [ShippingCapacityRepository],
};

const deleteProvinceShippingCompanyPriorityUseCaseFactory =
  (shippingCompanyPriorityRepo: ShippingCapacityRepository) =>
  new DeleteProvinceShippingCompanyPriorityUseCase(shippingCompanyPriorityRepo);
export const deleteProvinceShippingCompanyPriorityUseCaseProvider = {
  provide: DeleteProvinceShippingCompanyPriorityUseCase,
  useFactory: deleteProvinceShippingCompanyPriorityUseCaseFactory,
  deps: [ShippingCapacityRepository],
};

const deleteZoneShippingCompanyPriorityUseCaseFactory =
  (shippingCompanyPriorityRepo: ShippingCapacityRepository) =>
  new DeleteZoneShippingCompanyPriorityUseCase(shippingCompanyPriorityRepo);
export const deleteZoneShippingCompanyPriorityUseCaseProvider = {
  provide: DeleteZoneShippingCompanyPriorityUseCase,
  useFactory: deleteZoneShippingCompanyPriorityUseCaseFactory,
  deps: [ShippingCapacityRepository],
};

const getProvinceCapacityUseCaseFactory =
  (shippingCompanyPriorityRepo: ShippingCapacityRepository) =>
  new GetProvinceCapacityUseCase(shippingCompanyPriorityRepo);
export const getProvinceCapacityUseCaseProvider = {
  provide: GetProvinceCapacityUseCase,
  useFactory: getProvinceCapacityUseCaseFactory,
  deps: [ShippingCapacityRepository],
};

const getShippingCompaniesUseCaseFactory =
  (shippingCompanyPriorityRepo: ShippingCapacityRepository) =>
  new GetShippingCompaniesUseCase(shippingCompanyPriorityRepo);
export const getShippingCompaniesUseCaseProvider = {
  provide: GetShippingCompaniesUseCase,
  useFactory: getShippingCompaniesUseCaseFactory,
  deps: [ShippingCapacityRepository],
};

const getZonesInProvinceUseCaseFactory =
  (shippingCompanyPriorityRepo: ShippingCapacityRepository) =>
  new GetZonesInProvinceUseCase(shippingCompanyPriorityRepo);
export const getZonesInProvinceUseCaseProvider = {
  provide: GetZonesInProvinceUseCase,
  useFactory: getZonesInProvinceUseCaseFactory,
  deps: [ShippingCapacityRepository],
};

const getProvinceShippingCompaniesPrioritiesUseCaseFactory =
  (shippingCompanyPriorityRepo: ShippingCapacityRepository) =>
  new GetProvinceShippingCompanyPrioritiesUseCase(shippingCompanyPriorityRepo);
export const getProvinceShippingCompaniesPrioritiesUseCaseProvider = {
  provide: GetProvinceShippingCompanyPrioritiesUseCase,
  useFactory: getProvinceShippingCompaniesPrioritiesUseCaseFactory,
  deps: [ShippingCapacityRepository],
};

const getZoneShippingCompaniesPrioritiesUseCaseFactory =
  (shippingCompanyPriorityRepo: ShippingCapacityRepository) =>
  new GetZoneShippingCompanyPrioritiesUseCase(shippingCompanyPriorityRepo);
export const getZoneShippingCompanyPrioritiesUseCaseProvider = {
  provide: GetZoneShippingCompanyPrioritiesUseCase,
  useFactory: getZoneShippingCompaniesPrioritiesUseCaseFactory,
  deps: [ShippingCapacityRepository],
};

const getAllocationServiceStatusUseCaseFactory =
  (allocationServiceStatusRepo: AllocationServiceRepository) =>
  new GetAllocationServiceStatusUseCase(allocationServiceStatusRepo);
export const getAllocationServiceStatusUseCaseProvider = {
  provide: GetAllocationServiceStatusUseCase,
  useFactory: getAllocationServiceStatusUseCaseFactory,
  deps: [AllocationServiceRepository],
};

const updateAllocationServiceStatusUseCaseFactory =
  (allocationServiceStatusRepo: AllocationServiceRepository) =>
  new UpdateAllocationServiceStatusUseCase(allocationServiceStatusRepo);
export const updateAllocationServiceStatusUseCaseProvider = {
  provide: UpdateAllocationServiceStatusUseCase,
  useFactory: updateAllocationServiceStatusUseCaseFactory,
  deps: [AllocationServiceRepository],
};

const runAllocationServiceUseCaseFactory =
  (allocationServiceStatusRepo: AllocationServiceRepository) =>
  new RunAllocationServicesUseCase(allocationServiceStatusRepo);
export const runAllocationServiceUseCaseProvider = {
  provide: RunAllocationServicesUseCase,
  useFactory: runAllocationServiceUseCaseFactory,
  deps: [AllocationServiceRepository],
};

const updateUnAllocationServiceStatusUseCaseFactory =
  (unAllocationServiceStatusRepo: UnAllocationServiceRepository) =>
  new UpdateUnAllocationServiceStatusUseCase(unAllocationServiceStatusRepo);
export const updateUnAllocationServiceStatusUseCaseProvider = {
  provide: UpdateUnAllocationServiceStatusUseCase,
  useFactory: updateUnAllocationServiceStatusUseCaseFactory,
  deps: [UnAllocationServiceRepository],
};

const getOrdersListUseCaseFactory =
  (orderRepo: OrderRepository) =>
  new GetOrdersListUseCase(orderRepo);
export const getOrdersListUseCaseProvider = {
  provide: GetOrdersListUseCase,
  useFactory: getOrdersListUseCaseFactory,
  deps: [OrderRepository],
};

const getOrderDetailUseCaseFactory =
  (orderRepo: OrderRepository) =>
  new GetOrderDetailUseCase(orderRepo);
export const getOrderDetailUseCaseProvider = {
  provide: GetOrderDetailUseCase,
  useFactory: getOrderDetailUseCaseFactory,
  deps: [OrderRepository],
};

const getCountriesUseCaseFactory =
  (countryRepository: CountryRepository) => new GetCountriesUseCase(countryRepository);
export const getCountriesUseCaseProvider = {
  provide: GetCountriesUseCase,
  useFactory: getCountriesUseCaseFactory,
  deps: [CountryRepository],
};

const trackEventUseCaseFactory = (eventTrackingRepo: EventTrackingRepository) =>
    new TrackEventUseCase(eventTrackingRepo);
export const trackEventUseCaseProvider = {
    provide: TrackEventUseCase,
    useFactory: trackEventUseCaseFactory,
    deps: [EventTrackingRepository],
};

const getProvincesUseCaseFactory = (provincesRepo: ProvinceRepository) =>
    new GetProvincesUseCase(provincesRepo);
export const getProvincesUseCaseProvider = {
    provide: GetProvincesUseCase,
    useFactory: getProvincesUseCaseFactory,
    deps: [ProvinceRepository],
};

@NgModule({
    providers: [
        createProvinceShippingCompanyUseCaseProvider,
        updateProvinceShippingCompanyUseCaseProvider,
        createZoneShippingCompanyUseCaseProvider,
        updateZoneShippingCompanyUseCaseProvider,
        updateProvinceShippingCompanyPriorityUseCaseProvider,
        updateZoneShippingCompanyPriorityUseCaseProvider,
        deleteProvinceShippingCompanyPriorityUseCaseProvider,
        deleteZoneShippingCompanyPriorityUseCaseProvider,
        getProvinceCapacityUseCaseProvider,
        getShippingCompaniesUseCaseProvider,
        getZonesInProvinceUseCaseProvider,
        getProvinceShippingCompaniesPrioritiesUseCaseProvider,
        getZoneShippingCompanyPrioritiesUseCaseProvider,
        getAllocationServiceStatusUseCaseProvider,
        updateAllocationServiceStatusUseCaseProvider,
        runAllocationServiceUseCaseProvider,
        updateUnAllocationServiceStatusUseCaseProvider,
        getOrdersListUseCaseProvider,
        getOrderDetailUseCaseProvider,
        getCountriesUseCaseProvider,
        trackEventUseCaseProvider,
        getProvincesUseCaseProvider,
        { provide: ShippingCapacityRepository, useClass: ShippingCapacityRepositoryImplementation },
        { provide: AllocationServiceRepository, useClass: AllocationServiceRepositoryImplementation },
        { provide: UnAllocationServiceRepository, useClass: UnAllocationServiceRepositoryImplementation },
        { provide: OrderRepository, useClass: OrderRepositoryImplementation },
        { provide: CountryRepository, useClass: CountryRepositoryImpl },
        { provide: EventTrackingRepository, useClass: EventTrackingRepositoryImpl },
        { provide: ProvinceRepository, useClass: ProvinceRepositoryImplementation },

    ],
    imports: [
        CommonModule,
        HttpClientModule,
    ],
})
export class DataModule { }
