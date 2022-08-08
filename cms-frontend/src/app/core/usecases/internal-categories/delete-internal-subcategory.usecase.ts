import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { InternalCategoryRepository } from '../../repositories/internal-category.repository';
export class DeleteInternalSubCategoryUseCase implements UseCase<string , {isSubCategoryDeleted: boolean}> {
  constructor(private internalCategoryRepository: InternalCategoryRepository) { }
  execute(subCategoryId: string): Observable<{isSubCategoryDeleted: boolean}> {
    return this.internalCategoryRepository.deleteInternalSubCategory(subCategoryId);
  }
}
