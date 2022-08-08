import { Observable } from 'rxjs';
import {
  CategoryFilterModel,
  CategoryModel,
  PaginatedVariantGroupList,
  VariantGroupFilterModel,
  VariantGroupModel,
} from '@core/domain/variant-group.model';
export abstract class VariantGroupsRepository {
  abstract getProducts(filter: VariantGroupFilterModel): Observable<PaginatedVariantGroupList>;
  abstract getProductById(productId: string): Observable<VariantGroupModel>;
  abstract addProduct(variantGroup: VariantGroupModel): Observable<void>;
  abstract editProduct(variantGroup: VariantGroupModel): Observable<void>;
  abstract getCategories(filter: CategoryFilterModel): Observable<CategoryModel[]>;
}
