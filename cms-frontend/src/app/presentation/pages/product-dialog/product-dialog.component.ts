import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { VariantGroupModel } from '@core/domain/variant-group.model';
import { TrackEventTrackingUseCase } from '@core/usecases/event-tracking/track-event-tracking.usecase';
import { AddProductUseCase } from '@core/usecases/variant-groups/add-product.usecase';
import { EditProductUseCase } from '@core/usecases/variant-groups/edit-product.usecase';
import { GetProductByIdUseCase } from '@core/usecases/variant-groups/get-product-by-id.usecase';
import { ProductsService } from '@presentation/@core/utils/products.service';
import { ToastService } from '@presentation/@core/utils/toast.service';
import { finalize, take } from 'rxjs/operators';
@Component({
  selector: 'ngx-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
})
export class ProductDialogComponent implements OnInit, OnDestroy {
  @Output() closeProductDialog = new EventEmitter<void>();
  variantGroup = {} as VariantGroupModel;
  variantGroupId: string;
  isLoading = false;
  isSubmittingForm = false;
  constructor(
    private toast: ToastService,
    private addProductUseCase: AddProductUseCase,
    private editProductUseCase: EditProductUseCase,
    private getProductByIdUseCase: GetProductByIdUseCase,
    private productsService: ProductsService,
    private trackEventTrackingUseCase: TrackEventTrackingUseCase,
  ) { }
  ngOnDestroy(): void {
    this.clearDialog();
  }
  ngOnInit(): void {
    this.trackEventTrackingUseCase.execute({
      eventName: 'cms_add_edit_product_page_view',
    });
    this.productsService.editedVariantGroupId.pipe(take(1)).subscribe(variantGroupId => {
      this.variantGroupId = variantGroupId;
      if (variantGroupId) {
        this.isLoading = true;
        this.getProductByIdUseCase.execute(this.variantGroupId).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe((data) => {
          this.productsService.variants = data.variants;
          this.productsService.editedVariantGroup = data;
          this.productsService.initializeFormWithVariantGroup(data);
          this.variantGroup = data;
        });
      }
    });
  }
  onAddProduct() {
    const variantGroup = this.productsService.getVariantGroup();
    if(!variantGroup.internalCategoryId) {
      this.toast.showToast('Error', 'Internal category is missing');
    } else {
      this.isSubmittingForm = true;
      this.addProductUseCase.execute(variantGroup).pipe(finalize(() => {
        this.isSubmittingForm = false;
      })).subscribe(() => {
        this.trackEventTrackingUseCase.execute({
          eventName: 'cms_on_add_product',
        });
        this.closeProductDialog.emit();
      }, ({ error }) => {
        this.toast.showToast('Error', error.msg ?? 'An Error Occured!');
      });
    }
  }
  onEditProduct() {
    this.trackEventTrackingUseCase.execute({
      eventName: 'cms_edit_product_page_view',
    });
    const variantGroup = this.productsService.getVariantGroup();
    if(!variantGroup.internalCategoryId) {
      this.toast.showToast('Error', 'Internal category is missing');
    } else {
      this.isSubmittingForm = true;
      this.editProductUseCase.execute(variantGroup).pipe(finalize(() => {
        this.isSubmittingForm = false;
      })).subscribe(() => {
        this.trackEventTrackingUseCase.execute({
          eventName: 'cms_on_edit_product',
        });
        this.closeProductDialog.emit();
      }, ({ error }) => {
        this.toast.showToast('Error', error.msg ?? 'An Error Occured!');
      });
    }
  }
  onCloseDialog() {
    this.closeProductDialog.emit();
  }
  clearDialog() {
    this.productsService.clearEditedVariantGroupId();
    this.productsService.editedVariantGroup = undefined;
    this.productsService.variants = [];
    this.productsService.initializeForm();
  }
}
