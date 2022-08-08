import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CategoryFilterModel,
  CategoryModel,
  PaginatedVariantGroupList,
  VariantGroupFilterModel,
  VariantGroupModel,
} from '@core/domain/variant-group.model';
import { VariantGroupsRepository } from '@core/repositories/variant-groups.repository';
import { VariantGroupRepositoryMapper } from './mappers/variant-group-repository.mapper';
import { ProductApisService } from './product-apis.service';
import { CategoryRepositoryMapper } from './mappers/category-repository.mapper';
@Injectable({
  providedIn: 'root',
})
export class VariantGroupRepositoryImplementation extends VariantGroupsRepository {
  variantGroupRepositoryMapper = new VariantGroupRepositoryMapper();
  categoryRepositoryMapper = new CategoryRepositoryMapper();
  constructor(
    private productApisService: ProductApisService,
  ) {
    super();
  }
  getProducts(filter: VariantGroupFilterModel): Observable<PaginatedVariantGroupList> {
    return this.productApisService.getProducts(filter).pipe(
      map(res => ({
        allProductsCount: res.counted,
        isLastPage: res.isLastPage,
        variantGroups: res.variantGroups.map(this.variantGroupRepositoryMapper.mapFrom),
      })),
    );
  }
  getProductById(productId: string): Observable<VariantGroupModel> {
    return this.productApisService.getProductById(productId).pipe(map(this.variantGroupRepositoryMapper.mapFrom));
  }
  addProduct(variantGroup: VariantGroupModel): Observable<void> {
    return this.productApisService.createProduct(this.variantGroupRepositoryMapper.mapTo(variantGroup));
  }
  editProduct(variantGroup: VariantGroupModel): Observable<void> {
    return this.productApisService.updateProduct(this.variantGroupRepositoryMapper.mapTo(variantGroup));
  }
  getCategories(filter: CategoryFilterModel): Observable<CategoryModel[]> {
    return this.productApisService.getCategories(filter).pipe(map(this.categoryRepositoryMapper.mapFrom));
  }
}
