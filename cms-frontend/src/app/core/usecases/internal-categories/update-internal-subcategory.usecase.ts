import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { InternalSubCategoryModel } from '../../domain/internal-category.model';
import { InternalCategoryRepository } from '../../repositories/internal-category.repository';
export class UpdateInternalSubCategoriesUseCase
  implements UseCase<InternalSubCategoryModel, InternalSubCategoryModel> {
  constructor(private internalCategoryRepository: InternalCategoryRepository) { }
  execute(updatedSubCategory: InternalSubCategoryModel): Observable<InternalSubCategoryModel> {
    return this.internalCategoryRepository.updateInternalSubCategory(updatedSubCategory);
  }
}
