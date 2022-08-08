import { Observable } from 'rxjs';
import { UploadedImageUrl } from '@core/domain/utilities.model';
export abstract class UtilitiesRepository {
  abstract uploadImage(file: FormData): Observable<UploadedImageUrl>;
}
