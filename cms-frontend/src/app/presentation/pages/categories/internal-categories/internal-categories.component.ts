import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DeleteInternalCategoryUseCase } from '@core/usecases/internal-categories/delete-internal-category.usecase';
import { Store } from '@ngrx/store';
import { ToastService } from '@presentation/@core/utils/toast.service';
import { finalize } from 'rxjs/operators';
import { InternalCategoryModel } from '@core/domain/internal-category.model';
import { CreateInternalCategoryUseCase } from '@core/usecases/internal-categories/create-internal-category.usecase';
import { AddCategoryComponent } from '../shared-categories-components/add-category/add-category.component';
import { InternalCategoriesViewActions } from './state/actions';
import {
  selectInternalCategoriesList,
  selectLoading,
  selectselectInternalCategoriesErrorMessage,
} from './state/internal-categories.reducer';
import { Observable } from 'rxjs';
import { TrackEventTrackingUseCase } from '@core/usecases/event-tracking/track-event-tracking.usecase';
@Component({
  selector: 'ngx-internal-categories',
  templateUrl: './internal-categories.component.html',
  styleUrls: ['./internal-categories.component.scss'],
})
export class InternalCategoriesComponent implements OnInit {
  @ViewChild('addCategoryComponent') addCategoryComponent: AddCategoryComponent;
  @Output() editCategoryClicked = new EventEmitter<InternalCategoryModel>();
  public categoriesList$: Observable<InternalCategoryModel[]>;
  public isLoading$: Observable<boolean>;
  public loading = false;
  mapping: { [k: string]: string } = {
    '=0': 'No Categories',
    '=1': '# Category',
    other: '# Categories',
  };
  constructor(
    private toast: ToastService,
    private createInternalCategoryUseCase: CreateInternalCategoryUseCase,
    private deleteInternalCategoryUseCase: DeleteInternalCategoryUseCase,
    private store: Store,
    private trackEventTrackingUseCase: TrackEventTrackingUseCase,
  ) { }
  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectLoading);
    this.getInternalCategories();
    this.trackEventTrackingUseCase.execute({
      eventName: 'cms_internal_categories_page_view',
    });
  }
  getInternalCategories(): void {
    this.store.dispatch(
      InternalCategoriesViewActions.loadInternalCategories(),
    );
    this.categoriesList$ = this.store.select(selectInternalCategoriesList);
    this.store.select(selectselectInternalCategoriesErrorMessage).subscribe(
      errMsg => {
        if (errMsg) {
          this.toast.showToast('Error', errMsg);
        }
      },
    );
  }
  onEditCategoryClicked(clickedCategory: InternalCategoryModel): void {
    this.editCategoryClicked.emit(clickedCategory);
  }
  onAddCategoryClicked(category: { englishName: string; arabicName: string }): void {
    this.loading = true;
    this.createInternalCategoryUseCase.execute(category).pipe(finalize(() => {
      this.loading = false;
    })).subscribe(() => {
      this.toast.showToast('Success', 'Category was successfully added!');
      this.addCategoryComponent.resetComponent();
      this.getInternalCategories();
    }, err => {
      this.toast.showToast('Error', err.error?.description);
    });
  }
  onDeleteCategory(categoryId: string): void {
    this.loading = true;
    this.deleteInternalCategoryUseCase.execute(categoryId).pipe(finalize(() => {
      this.loading = false;
    })).subscribe(({ isCategoryDeleted }) => {
      if (isCategoryDeleted) {
        this.toast.showToast('Success', 'Category successfully deleted!');
        this.getInternalCategories();
      } else {
        this.toast.showToast('Error', 'An error occured');
      }
    }, err => {
      this.toast.showToast('Error', err.error?.description);
    });
  }
}
