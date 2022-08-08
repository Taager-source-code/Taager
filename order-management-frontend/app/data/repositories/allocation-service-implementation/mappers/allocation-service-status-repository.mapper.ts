import { Mapper } from '../../../../core/base/mapper';
import { AllocationStatusModel } from '../../../../core/domain/allocationService';
import { AllocationStatusEntity } from '../entities/allocation-service-entity';
export class AllocationServiceStatusRepositoryMapper extends
  Mapper<AllocationStatusEntity, AllocationStatusModel> {
  mapFrom(param: AllocationStatusEntity): AllocationStatusModel {
    return {
      status: param.status,
    };
  }
  mapTo(param: AllocationStatusModel): AllocationStatusEntity {
    return {
      status: param.status,
    };
  }
}
