import { UseCase } from '@core/base/use-case';
import { UploadedImageUrl } from '@core/domain/utilities.model';
import { UtilitiesRepository } from '@core/repositories/utilities.repository';
import { Observable } from 'rxjs';
export class UploadImageUseCase implements UseCase<FormData, UploadedImageUrl>{
    constructor(private utilitiesRepository: UtilitiesRepository){ }
    execute(file: FormData): Observable<UploadedImageUrl>{
       return this.utilitiesRepository.uploadImage(file);
    }
}