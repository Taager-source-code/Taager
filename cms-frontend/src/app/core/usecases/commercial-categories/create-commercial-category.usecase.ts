import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { CommercialCategoryModel, CommercialCategoryName } from '@core/domain/commercial-category.model';
import { CommercialCategoryRepository } from '@core/repositories/commercial-category.repository';
export class CreateCommercialCategoryUseCase
  implements UseCase<CommercialCategoryModel, void> {
  constructor(
    private commercialCategoryRepository: CommercialCategoryRepository,
  ) {}
  execute(category: CommercialCategoryModel): Observable<void> {
    return this.commercialCategoryRepository.createCommercialCategory(
      category,
    );
  }
}
