import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URLS } from '@data/constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  InternalCategoryModel,
  InternalCategoryName,
  InternalSubCategoryModel,
} from '../../../core/domain/internal-category.model';
import { InternalCategoryRepository } from '../../../core/repositories/internal-category.repository';
import { InternalCategoryEntity, InternalSubCategoryEntity } from './entities/internal-category-entity';
import { InternalCategoryRepositoryMapper } from './mappers/internal-category-repository.mapper';
import { InternalSubCategoryRepositoryMapper } from './mappers/internal-subcategory-repository.mapper';
@Injectable({
  providedIn: 'root',
})
export class InternalCategoryRepositoryImplementation extends InternalCategoryRepository {
  public internalCategoryMapper = new InternalCategoryRepositoryMapper();
  public internalSubCategoryMapper = new InternalSubCategoryRepositoryMapper();
  constructor(
    private http: HttpClient,
  ) {
    super();
  }
  createInternalCategory(name: InternalCategoryName): Observable<void> {
    return this.http.post<({data: void})>(API_URLS.CREATE_INTERNAL_CATEGORY_URL, name).pipe(map(() => null));
  }
  createInternalSubCategory(
    params: {parentCategoryId: string; name: InternalCategoryName},
  ): Observable<void> {
    return this.http.post(
      API_URLS.CREATE_INTERNAL_SUB_CATEGORY_URL,
      this.internalSubCategoryMapper.mapTo(params)).pipe(map(() => null));
  }
  getInternalCategories(): Observable<InternalCategoryModel[]> {
    return this.http.get<{ data: InternalCategoryEntity[] }>(API_URLS.GET_INTERNAL_CATEGORIES_URL).pipe(
      map(response => response.data.map(this.internalCategoryMapper.mapFrom),
    ));
  }
  getInternalSubCategories(parentCategoryId: string): Observable<InternalSubCategoryModel[]> {
    return this.http.get<{ data: InternalSubCategoryEntity[] }>(
      API_URLS.GET_INTERNAL_SUB_CATEGORIES_URL(parentCategoryId))
      .pipe(map(response => response.data.map(this.internalSubCategoryMapper.mapFrom)));
  }
  getInternalSubCategoryById(subCategoryId: string): Observable<InternalSubCategoryModel> {
    return this.http.get<{data: InternalSubCategoryEntity}>(
      API_URLS.GET_INTERNAL_SUB_CATEGORY_BY_ID_URL(subCategoryId))
      .pipe(map(response => this.internalSubCategoryMapper.mapFrom(response.data)));
  }
  updateInternalCategory(updatedCategory: InternalCategoryModel): Observable<InternalCategoryModel> {
    return this.http.patch<Record<string, never>>(
      API_URLS.EDIT_INTERNAL_CATEGORY_URL(updatedCategory.id), updatedCategory.name)
      .pipe(map(() => updatedCategory));
  }
  updateInternalSubCategory(updatedSubCategory: InternalSubCategoryModel): Observable<InternalSubCategoryModel> {
    return this.http.patch<Record<string, never>>(
      API_URLS.EDIT_INTERNAL_CATEGORY_URL(updatedSubCategory.id), updatedSubCategory.name)
      .pipe(map(() => updatedSubCategory));
  }
  deleteInternalCategory(categoryId: string): Observable<{isCategoryDeleted: boolean}> {
    return this.http.delete<Record<string, never>>(
      API_URLS.DELETE_INTERNAL_CATEGORY_URL(categoryId))
      .pipe(map(() => ({isCategoryDeleted : true})));
  }
  deleteInternalSubCategory(subCategoryId: string): Observable<{isSubCategoryDeleted: boolean}> {
    return this.http.delete<Record<string, never>>(
      API_URLS.DELETE_INTERNAL_SUB_CATEGORY_URL(subCategoryId))
      .pipe(map(() => ({isSubCategoryDeleted : true})));
  }
}
