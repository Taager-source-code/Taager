import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { CommercialSubCategoryModel } from '@core/domain/commercial-category.model';
import { CommercialCategoryRepository } from '@core/repositories/commercial-category.repository';
export class GetCommercialSubCategoriesUseCase
  implements UseCase<string, CommercialSubCategoryModel[]> {
  constructor(
    private commercialCategoryRepository: CommercialCategoryRepository,
  ) {}
  execute(parentCategoryId: string): Observable<CommercialSubCategoryModel[]> {
    return this.commercialCategoryRepository.getCommercialSubCategories(
      parentCategoryId,
    );
  }
}
