import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { CommercialCategoryRepository } from '@core/repositories/commercial-category.repository';
export class DeleteCommercialSubCategoryUseCase
  implements UseCase<string, { isSubCategoryDeleted: boolean }> {
  constructor(private commercialCategoryRepository: CommercialCategoryRepository) {}
  execute(
    subCategoryId: string,
  ): Observable<{ isSubCategoryDeleted: boolean }> {
    return this.commercialCategoryRepository.deleteCommercialSubCategory(
      subCategoryId,
    );
  }
}
