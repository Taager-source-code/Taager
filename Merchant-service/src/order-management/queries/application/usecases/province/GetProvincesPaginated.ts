import { ProvinceRepo } from '../../contracts/ProvinceRepo';
import { GetProvincesPaginatedRequest } from '../../models/province/GetProvincesPaginatedRequest';
import GetProvincesPaginatedResponse from '../../models/province/GetProvincesPaginatedResponse';

export default class GetProvincesPaginated {
  private provincesRepo: ProvinceRepo;

  constructor(provincesRepo: ProvinceRepo) {
    this.provincesRepo = provincesRepo;
  }

  async execute(getProvincesPaginated: GetProvincesPaginatedRequest): Promise<GetProvincesPaginatedResponse> {
    return this.provincesRepo.getProvincesPaginated(getProvincesPaginated);
  }
}


