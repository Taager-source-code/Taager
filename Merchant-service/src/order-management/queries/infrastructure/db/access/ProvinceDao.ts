import { Service } from 'typedi';
import Province from '../../../../common/infrastructure/db/schemas/ProvinceSchema';
import { ProvinceModel } from '../../../../common/infrastructure/db/models/ProvinceModel';
import { GetProvincesPaginatedRequest } from '../../../application/models/province/GetProvincesPaginatedRequest';

@Service({ global: true })
export default class ProvinceDao {
  findActive(country: string): Promise<ProvinceModel[]> {
    return Province.find({ isActive: true, country: country }).exec();
  }

  findPaginated(getProvinces: GetProvincesPaginatedRequest): Promise<ProvinceModel[]> {
    return Province.find({ country: getProvinces.country })
      .limit(getProvinces.pageSize)
      .skip(getProvinces.pageSize * getProvinces.page)
      .lean(true)
      .exec();
  }

  countAll(country: string): Promise<number> {
    return Province.countDocuments({ country: country }).exec();
  }
}


