import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { InternalSubCategoryModel } from '../../domain/internal-category.model';
import { InternalCategoryRepository } from '../../repositories/internal-category.repository';
export class GetInternalSubCategoryByIdUseCase implements UseCase<string , InternalSubCategoryModel> {
  constructor(private internalCategoryRepository: InternalCategoryRepository) { }
  execute(subCategoryId): Observable<InternalSubCategoryModel> {
    return this.internalCategoryRepository.getInternalSubCategoryById(subCategoryId);
  }
}
