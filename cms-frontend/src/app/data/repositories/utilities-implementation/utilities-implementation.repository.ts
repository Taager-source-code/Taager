import { Injectable } from '@angular/core';
import { UploadedImageUrl } from '@core/domain/utilities.model';
import { UtilitiesRepository } from '@core/repositories/utilities.repository';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilitiesApisService } from './utilities-apis.service';
@Injectable({
  providedIn: 'root',
})
export class UtilitiesRepositoryImplementation extends UtilitiesRepository {
  constructor(
    private utilitiesApisService: UtilitiesApisService,
  ) {
    super();
  }
  uploadImage(file: FormData): Observable<UploadedImageUrl> {
    return this.utilitiesApisService.uploadImage(file).pipe(map((data) => ({ url: data.msg })));
  }
}
