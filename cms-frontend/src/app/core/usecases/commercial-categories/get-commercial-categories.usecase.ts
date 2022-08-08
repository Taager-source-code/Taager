import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { CommercialCategoryModel } from '@core/domain/commercial-category.model';
import { CommercialCategoryRepository } from '@core/repositories/commercial-category.repository';
export class GetCommercialCategoriesUseCase
  implements UseCase<string, CommercialCategoryModel[]> {
  constructor(private commercialCategoryRepository: CommercialCategoryRepository) {}
  execute(countryCode: string): Observable<CommercialCategoryModel[]> {
    return this.commercialCategoryRepository.getCommercialCategories(countryCode);
  }
}
