import { Mapper } from '../../../../core/base/mapper';
import { ProvinceCapacityModel } from '../../../../core/domain/capacity.model';
import { ProvinceCapacityEntity } from '../entities/province-capacity-entity';
export class ProvinceCapacityRepositoryMapper extends Mapper <ProvinceCapacityEntity, ProvinceCapacityModel> {
  mapFrom(param: ProvinceCapacityEntity): ProvinceCapacityModel {
    return {
      provinceName: param.name,
      numberOfZones: param.noOfZones,
      remainingCapacity: param.remainingCapacity,
      provinceId: param.provinceId,
    };
  }
  mapTo(param: ProvinceCapacityModel): ProvinceCapacityEntity {
    return {
      name: param.provinceName,
      noOfZones: param.numberOfZones,
      remainingCapacity: param.remainingCapacity,
      provinceId: param.provinceId,
    };
  }
}
