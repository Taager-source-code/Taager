import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { finalize } from 'rxjs/operators';
import {
  CreateInternalSubCategoryUseCase,
} from '@core/usecases/internal-categories/create-internal-subcategory.usecase';
import {
  CreateCommercialSubCategoryUseCase,
} from '@core/usecases/commercial-categories/create-commercial-sub-category.usecase';
import { ToastService } from '@presentation/@core/utils/toast.service';
import { CategoryTypes } from '@presentation/@core/contstants/categories';
import { CategoryModel, CategoryName, SubCategoryModel } from '@presentation/@core/interfaces/categories.interface';
import { UseCase } from '@core/base/use-case';
@Component({
  selector: 'ngx-add-sub-category',
  templateUrl: './add-sub-category.component.html',
  styleUrls: ['./add-sub-category.component.scss'],
})
export class AddSubCategoryComponent implements OnInit {
  @Input() parentCategory: CategoryModel | SubCategoryModel;
  @Input() categoryType: CategoryTypes;
  newSubCategoryForm: FormGroup;
  loading = false;
  constructor(
    private dialogRef: NbDialogRef<AddSubCategoryComponent>,
    private createInternalSubCategoryUseCase: CreateInternalSubCategoryUseCase,
    private createCommercialSubCategoryUseCase: CreateCommercialSubCategoryUseCase,
    private toast: ToastService,
  ) { }
  ngOnInit(): void {
    this.newSubCategoryForm = new FormGroup({
      englishName: new FormControl('', Validators.required),
      arabicName: new FormControl('', Validators.required),
    });
  }
  onAddSubCategory(): void {
    const params = {
      parentCategoryId: this.parentCategory.id,
      name: {
        ...this.newSubCategoryForm.value,
      },
    };
    this.loading = true;
    if(this.categoryType === CategoryTypes.internal) {
      this.executeCreateSubCategoryAction(this.createInternalSubCategoryUseCase, params);
    } else if (this.categoryType === CategoryTypes.commercial) {
      this.executeCreateSubCategoryAction(this.createCommercialSubCategoryUseCase, params);
    } else {
      this.loading = false;
      this.toast.showToast('Error', 'An error occurred!');
    }
  }
  executeCreateSubCategoryAction(
    useCase: UseCase<{ parentCategoryId: string; name: CategoryName },void>,
    params,
  ): void {
    useCase.execute(params).pipe(finalize(() => {
      this.loading = false;
    })).subscribe(() => {
      this.dialogRef.close(true);
      this.toast.showToast('Success', 'Category was successfully added!');
    }, err => {
      const errorMessage = err.error?.description ?? 'An error occurred!';
      this.toast.showToast('Error', errorMessage);
    });
  }
  onCloseDialog(): void {
    this.dialogRef.close();
  }
}
