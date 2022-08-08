import { Mapper } from '@core/base/mapper';
import { ProvinceModel } from '@core/domain/province.model';
import { ProvinceEntity } from '../entities/province-entity';
export class ProvinceRepositoryMapper extends Mapper<ProvinceEntity, ProvinceModel> {
  mapFrom(param: ProvinceEntity): ProvinceModel {
    return {
      branch: param.branch,
      country: param.country,
      greenZones: param.greenZones,
      isActive: param.isActive,
      location: param.location,
      id: param._id,
    };
  }
  mapTo(param: ProvinceModel): ProvinceEntity {
    return {
      branch: param.branch,
      country: param.country,
      greenZones: param.greenZones,
      isActive: param.isActive,
      location: param.location,
      _id: param.id,
    };
  }
}
