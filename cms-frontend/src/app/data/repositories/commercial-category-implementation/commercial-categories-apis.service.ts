import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommercialCategoryName } from '@core/domain/commercial-category.model';
import { API_URLS } from '@data/constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommercialCategoryEntity, CommercialSubCategoryEntity } from './entities/commercial-category-entity';
@Injectable({
  providedIn: 'root',
})
export class CommercialCategoriesApisService {
  constructor(private http: HttpClient) { }
  createCommercialCategory(category: CommercialCategoryEntity): Observable<void> {
    return this.http.post<({data: void})>(API_URLS.CREATE_COMMERCIAL_CATEGORY_URL, category).pipe(map(() => null));
  }
  createCommercialSubCategory(subCategory: CommercialSubCategoryEntity): Observable<void> {
    return this.http.post<({data: void})>(
      API_URLS.CREATE_COMMERCIAL_SUB_CATEGORY_URL, subCategory).pipe(map(() => null));
  }
  getCommercialCategories(countryCode: string): Observable<CommercialCategoryEntity[]> {
    return this.http.get<({data: CommercialCategoryEntity[]})>(
      API_URLS.GET_COMMERCIAL_CATEGORIES_URL, {params: {country: countryCode}}).pipe(map(response => response.data));
  }
  getCommercialSubCategories(parentId: string): Observable<CommercialSubCategoryEntity[]> {
    return this.http.get<({data: CommercialSubCategoryEntity[]})>(
      API_URLS.GET_COMMERCIAL_SUB_CATEGORIES_URL(parentId)).pipe(map(response => response.data));
  }
  getCommercialSubCategoryById(subCategoryId: string): Observable<CommercialSubCategoryEntity> {
    return this.http.get<({data: CommercialSubCategoryEntity})>(
      API_URLS.GET_COMMERCIAL_SUB_CATEGORY_BY_ID_URL(subCategoryId)).pipe(map(response => response.data));
  }
  updateCommercialCategory(category: CommercialCategoryEntity): Observable<void> {
    return this.http.patch<{data: void}>(
      API_URLS.EDIT_COMMERCIAL_CATEGORY_URL(category.categoryId), category).pipe(map(() => null));
  }
  updateCommercialSubCategory(category: CommercialSubCategoryEntity): Observable<void> {
    return this.http.patch<{data: void}>(API_URLS.EDIT_COMMERCIAL_SUB_CATEGORY_URL(category.categoryId),
    {englishName: category.englishName, arabicName: category.arabicName}).pipe(map(() => null));
  }
  deleteCommercialCategory(categoryId: string): Observable<void> {
    return this.http.delete<{data: void}>(
      API_URLS.DELETE_COMMERCIAL_CATEGORY_URL(categoryId)).pipe(map(() => null));
  }
  deleteCommercialSubCategory(categoryId: string): Observable<void> {
    return this.http.delete<{data: void}>(
      API_URLS.DELETE_COMMERCIAL_SUB_CATEGORY_URL(categoryId)).pipe(map(() => null));
  }
}
