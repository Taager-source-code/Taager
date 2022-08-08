import { ProvinceRepo } from '../../application/contracts/ProvinceRepo';
import ProvinceDao from '../db/access/ProvinceDao';
import { Service } from 'typedi';
import { GetProvincesResponse } from '../../application/models/province/GetProvincesResponse';
import { GetProvincesPaginatedRequest } from '../../application/models/province/GetProvincesPaginatedRequest';
import GetProvincesPaginatedResponse from '../../application/models/province/GetProvincesPaginatedResponse';
import Logger from '../../../../shared-kernel/infrastructure/logging/general.log';

@Service({ global: true })
export default class ProvinceRepoImpl implements ProvinceRepo {
  private provinceDao: ProvinceDao;

  constructor(provinceDao: ProvinceDao) {
    this.provinceDao = provinceDao;
  }

  async getProvinces(country: string): Promise<GetProvincesResponse[]> {
    Logger.info('getting all provinces for country', { country: country });
    const provinces = await this.provinceDao.findActive(country);
    return provinces as GetProvincesResponse[];
  }

  async getProvincesPaginated(
    getProvincesRequest: GetProvincesPaginatedRequest,
  ): Promise<GetProvincesPaginatedResponse> {
    Logger.info('getting provinces for country', {
      country: getProvincesRequest.country,
    });
    const provinces = await this.provinceDao.findPaginated(getProvincesRequest);
    const provinceCount = await this.provinceDao.countAll(getProvincesRequest.country);
    const endPageFlag = Math.ceil(provinceCount / getProvincesRequest.pageSize) === getProvincesRequest.page;
    return new GetProvincesPaginatedResponse(provinces, provinceCount, endPageFlag);
  }
}


