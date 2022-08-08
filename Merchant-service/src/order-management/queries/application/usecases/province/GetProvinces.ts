import { ProvinceRepo } from '../../contracts/ProvinceRepo';
import { GetProvincesResponse } from '../../models/province/GetProvincesResponse';

export default class GetProvinces {
  private provincesRepo: ProvinceRepo;

  constructor(provincesRepo: ProvinceRepo) {
    this.provincesRepo = provincesRepo;
  }

  async execute(country: string): Promise<GetProvincesResponse[]> {
    return this.provincesRepo.getProvinces(country);
  }
}



