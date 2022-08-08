import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { API_URLS } from '../../constants/api-urls';
import { ProvinceModel } from '@core/domain/province.model';
import { ProvinceRepositoryMapper } from './mappers/province.mapper';
import { map, tap } from 'rxjs/operators';
import { ProvinceEntity } from './entities/province-entity';
@Injectable({
    providedIn: 'root',
})
export class ProvinceAPIservice {
  private _provincesMapper = new ProvinceRepositoryMapper();
  private _provincesCache: {[country: string]: ProvinceModel[]} = {};
  constructor(private http: HttpClient) { }
  getProvinces(countryIsoCode3: string): Observable<ProvinceModel[]> {
    if(this._provincesCache[countryIsoCode3]?.length) {
      return of(this._provincesCache[countryIsoCode3]);
    } else {
      return this.http.get<{data: ProvinceEntity[]}>(API_URLS.GET_PROVINCES, {params: {country: countryIsoCode3}}).pipe(
        map( ({data}) => (
          data
            .map(province => this._provincesMapper.mapFrom(province))
            .filter(province => province.isActive))),
        tap(provinces => {
          this._provincesCache[countryIsoCode3] = provinces;
        }),
      );
    }
  }
}
