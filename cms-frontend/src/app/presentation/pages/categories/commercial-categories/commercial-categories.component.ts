import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommercialCategoryModel } from '@core/domain/commercial-category.model';
import {
  CreateCommercialCategoryUseCase,
 } from '@core/usecases/commercial-categories/create-commercial-category.usecase';
import {
  DeleteCommercialCategoryUseCase,
 } from '@core/usecases/commercial-categories/delete-commercial-category.usecase';
import { GetCommercialCategoriesUseCase } from '@core/usecases/commercial-categories/get-commercial-categories.usecase';
import { ToastService } from '@presentation/@core/utils/toast.service';
import { finalize } from 'rxjs/operators';
import { AddCategoryComponent } from '../shared-categories-components/add-category/add-category.component';
import { ProductsService } from '@presentation/@core/utils/products.service';
import {
  ToggleFeaturedCommercialCategoryUseCase,
} from '@core/usecases/commercial-categories/featured-commercial-category-toggle-usecase';
import { HttpErrorResponse } from '@angular/common/http';
import { TrackEventTrackingUseCase } from '@core/usecases/event-tracking/track-event-tracking.usecase';
@Component({
  selector: 'ngx-commercial-categories',
  templateUrl: './commercial-categories.component.html',
  styleUrls: ['./commercial-categories.component.scss'],
})
export class CommercialCategoriesComponent implements OnInit {
  @ViewChild('addCategoryComponent') addCategoryComponent: AddCategoryComponent;
  @Output() editCategoryClicked = new EventEmitter<CommercialCategoryModel>();
  public commercialCategoriesList: CommercialCategoryModel[] = [];
  public loading = false;
  mapping: {[k: string]: string} = {
    '=0': 'No Categories',
    '=1': '# Category',
    other: '# Categories',
  };
  constructor(
    private toast: ToastService,
    private getCommercialCategoriesUseCase: GetCommercialCategoriesUseCase,
    private deleteCommercialCategoryUseCase: DeleteCommercialCategoryUseCase,
    private createCommercialCategoryUseCase: CreateCommercialCategoryUseCase,
    private toggleFeaturedCommercialCategoryUseCase: ToggleFeaturedCommercialCategoryUseCase,
    private productsService: ProductsService,
    private trackEventTrackingUseCase: TrackEventTrackingUseCase,
  ) {}
  ngOnInit(): void {
    this.getCommercialCategories();
    this.trackEventTrackingUseCase.execute({
      eventName: 'cms_commercial_categories_page_view',
    });
  }
  getCommercialCategories(): void {
    this.commercialCategoriesList = [];
    this.loading = true;
    this.getCommercialCategoriesUseCase
      .execute(this.productsService.selectedCountryCode)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(
        (categories) => {
          this.commercialCategoriesList = categories;
        },
        (err) => {
          this.toast.showToast('Error', err.error?.description);
        },
      );
  }
  onEditCategoryClicked(clickedCategory: CommercialCategoryModel): void {
    this.editCategoryClicked.emit(clickedCategory);
  }
  onAddCategoryClicked(name: {
    englishName: string;
    arabicName: string;
  }): void {
    this.loading = true;
    const category: CommercialCategoryModel = {
      name,
      country: this.productsService.selectedCountryCode,
      featured: false,
      sorting: this.commercialCategoriesList.length,
    };
    this.createCommercialCategoryUseCase
      .execute(category)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(
        () => {
          this.toast.showToast(
            'Success',
            'Commercial Category successfully added!',
          );
          this.addCategoryComponent.resetComponent();
          this.getCommercialCategories();
        },
        (err) => {
          this.toast.showToast('Error', err.error?.description);
        },
      );
  }
  onDeleteCategory(categoryId: string): void {
    this.loading = true;
    this.deleteCommercialCategoryUseCase
      .execute(categoryId)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(
        ({ isCategoryDeleted }) => {
          if (isCategoryDeleted) {
            this.toast.showToast(
              'Success',
              'Commercial Category successfully deleted!',
            );
            this.getCommercialCategories();
          } else {
            this.toast.showToast('Error', 'An error occurred');
          }
        },
        (err) => {
          this.toast.showToast('Error', err.error?.description);
        },
      );
  }
  onToggleFeaturedCategory(category: CommercialCategoryModel) {
    this.toggleFeaturedCommercialCategoryUseCase.execute(category).subscribe(({isFeaturedCategory}) => {
      const successfulAction = isFeaturedCategory? 'featured' : 'unfeatured';
      this.toast.showToast(
        'Success',
        `Commercial category ${successfulAction}!`,
      );
      this.getCommercialCategories();
    }, (err: HttpErrorResponse) => {
      this.toast.showToast('Error', err.error?.description ?? 'An error occurred');
    });
  }
}
