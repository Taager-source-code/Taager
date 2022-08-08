import { Injectable } from '@angular/core';
import {
  CommercialCategoryName,
  CommercialCategoryModel,
  CommercialSubCategoryModel,
} from '@core/domain/commercial-category.model';
import { CommercialCategoryRepository } from '@core/repositories/commercial-category.repository';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommercialCategoriesApisService } from './commercial-categories-apis.service';
import { CommercialCategoryRepositoryMapper } from './mappers/commercial-category-repository.mapper';
import { CommercialSubCategoryRepositoryMapper } from './mappers/commercial-sub-category-repository.mapper';
@Injectable({
  providedIn: 'root',
})
export class CommercialCategoryImplementationRepository extends CommercialCategoryRepository {
  public commercialCategoryMapper = new CommercialCategoryRepositoryMapper();
  public commercialSubCategoryMapper = new CommercialSubCategoryRepositoryMapper();
  constructor(
    private commercialCategoriesApisService: CommercialCategoriesApisService,
  ) {
    super();
  }
  createCommercialCategory(category: CommercialCategoryModel): Observable<void> {
    return this.commercialCategoriesApisService.createCommercialCategory(
      this.commercialCategoryMapper.mapTo(category),
    );
  }
  createCommercialSubCategory(params: { parentCategoryId: string; name: CommercialCategoryName }): Observable<void> {
    return this.commercialCategoriesApisService.createCommercialSubCategory(
      this.commercialSubCategoryMapper.mapTo(params),
    );
  }
  getCommercialCategories(countryCode: string): Observable<CommercialCategoryModel[]> {
    return this.commercialCategoriesApisService.getCommercialCategories(countryCode).pipe(
      map(categories => categories.map(category => this.commercialCategoryMapper.mapFrom(category))));
  }
  getCommercialSubCategories(parentCategoryId: string): Observable<CommercialSubCategoryModel[]> {
    return this.commercialCategoriesApisService.getCommercialSubCategories(parentCategoryId).pipe(
      map(categories => categories.map(category => this.commercialSubCategoryMapper.mapFrom(category))));
  }
  getCommercialSubCategoryById(subCategoryId: string): Observable<CommercialSubCategoryModel> {
    return this.commercialCategoriesApisService.getCommercialSubCategoryById(subCategoryId).pipe(
      map(this.commercialSubCategoryMapper.mapFrom));
  }
  updateCommercialCategory(updatedCategory: CommercialCategoryModel): Observable<CommercialCategoryModel> {
    return this.commercialCategoriesApisService.updateCommercialCategory(
      this.commercialCategoryMapper.mapTo(updatedCategory))
      .pipe(map(() => updatedCategory));
  }
  updateCommercialSubCategory(updatedSubCategory: CommercialSubCategoryModel): Observable<CommercialSubCategoryModel> {
    return this.commercialCategoriesApisService.updateCommercialSubCategory(
      this.commercialSubCategoryMapper.mapTo(updatedSubCategory))
      .pipe(map(() => updatedSubCategory));
  }
  deleteCommercialCategory(categoryId: string): Observable<{ isCategoryDeleted: boolean }> {
    return this.commercialCategoriesApisService.deleteCommercialCategory(categoryId)
      .pipe(map(() => ({isCategoryDeleted: true})));
  }
  deleteCommercialSubCategory(subCategoryId: string): Observable<{ isSubCategoryDeleted: boolean }> {
    return this.commercialCategoriesApisService.deleteCommercialSubCategory(subCategoryId)
      .pipe(map(() => ({isSubCategoryDeleted: true})));
  }
  toggleFeaturedCommercialCategory(category: CommercialCategoryModel): Observable<{ isFeaturedCategory: boolean }> {
    const updatedCategory: CommercialCategoryModel = { ...category, featured: !category.featured };
    return this.commercialCategoriesApisService.updateCommercialCategory(
      this.commercialCategoryMapper.mapTo(updatedCategory))
      .pipe(map(() => ({ isFeaturedCategory: updatedCategory.featured })));
  }
}
