import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ProvinceModel } from '@core/domain/province.model';
import { ProvinceRepository } from '@core/repositories/province.repository';
import { ProvinceAPIservice } from './province-apis-service';
@Injectable({
  providedIn: 'root',
})
export class ProvinceRepositoryImplementation extends ProvinceRepository {
  constructor(
    private _provinceAPIservice: ProvinceAPIservice,
) {
    super();
}
  getProvinces(countryIsoCode3: string): Observable<ProvinceModel[]> {
    return this._provinceAPIservice.getProvinces(countryIsoCode3);
  }
}
