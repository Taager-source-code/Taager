/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryFilterModel, VariantGroupFilterModel } from '@core/domain/variant-group.model';
import { API_URLS } from '@data/constants';
import { Observable, of } from 'rxjs';
import {
  CategoryListEntity,
  PaginatedVariantGroupListEntity,
  VariantGroupEntity,
} from './entities/variant-group-entity';
@Injectable({
  providedIn: 'root',
})
export class ProductApisService {
  constructor(private http: HttpClient) { }
  getProducts(filter: VariantGroupFilterModel): Observable<PaginatedVariantGroupListEntity> {
    return this.http.post<PaginatedVariantGroupListEntity>(API_URLS.VARIANT_GROUP_LIST_URL, filter);
  }
  getProductById(productId: string): Observable<VariantGroupEntity> {
    return this.http.get<VariantGroupEntity>(API_URLS.VARIANT_GROUP_BY_ID_URL(productId));
  }
  updateProduct(variantGroup: VariantGroupEntity): Observable<void> {
    return this.http.put<void>(API_URLS.VARIANT_GROUP_BY_ID_URL(variantGroup._id), variantGroup);
  }
  createProduct(variantGroup: VariantGroupEntity): Observable<void> {
    return this.http.post<void>(API_URLS.VARIANT_GROUP_URL, variantGroup);
  }
  getCategories(categoryFilter: CategoryFilterModel): Observable<CategoryListEntity> {
    return this.http.get<CategoryListEntity>(API_URLS.CATEGOIES_URL, {
      params: categoryFilter.filter,
    });
  }
}
