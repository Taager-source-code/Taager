import { Mapper } from '../../../../core/base/mapper';
import { ProvinceZoneModel } from '../../../../core/domain/province.model';
import { ProvinceZoneEntity } from '../entities/province-zone-entity';
export class ProvinceZoneRepositoryMapper extends Mapper <ProvinceZoneEntity, ProvinceZoneModel> {
  mapFrom(param: ProvinceZoneEntity): ProvinceZoneModel {
    return {
      name: param.name,
      zoneId: param.zoneId,
      manuallyModified: param.manuallyModified,
    };
  }
  mapTo(param: ProvinceZoneModel): ProvinceZoneEntity {
    return {
     name: param.name,
     zoneId: param.zoneId,
     manuallyModified: param.manuallyModified,
    };
  }
}
