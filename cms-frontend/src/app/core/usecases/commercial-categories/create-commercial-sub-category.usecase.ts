import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { CommercialCategoryName } from '@core/domain/commercial-category.model';
import { CommercialCategoryRepository } from '@core/repositories/commercial-category.repository';
export class CreateCommercialSubCategoryUseCase
  implements
    UseCase<{ parentCategoryId: string; name: CommercialCategoryName }, void> {
  constructor(
    private commercialCategoryRepository: CommercialCategoryRepository,
  ) {}
  execute(params: {
    parentCategoryId: string;
    name: CommercialCategoryName;
  }): Observable<void> {
    return this.commercialCategoryRepository.createCommercialSubCategory(
      params,
    );
  }
}
