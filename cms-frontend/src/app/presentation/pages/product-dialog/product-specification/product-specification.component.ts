import { Component, OnInit } from '@angular/core';
import { UseCase } from '@core/base/use-case';
import { UserModel } from '@core/domain/user.model';
import { GetUserByTaagerIdUseCase } from '@core/usecases/user/get-user-by-taager-id.usecase';
import { GetUserUseCase } from '@core/usecases/user/get-user.usecase';
import { ProductsService } from '@presentation/@core/utils/products.service';
import { ToastService } from '@presentation/@core/utils/toast.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'ngx-product-specification',
  templateUrl: './product-specification.component.html',
  styleUrls: ['./product-specification.component.scss'],
})
export class ProductSpecificationComponent implements OnInit {
  public loadingVisibleToSellers = false;
  public visibleToSellersTaagerIds: string[] = [];
  public visibleToSellersObjectIds: string[] = [];
  public errorOccurred = false;
  constructor(
    public productsService: ProductsService,
    private toast: ToastService,
    private getUserUseCase: GetUserUseCase,
    private getUserByTaagerIdUseCase: GetUserByTaagerIdUseCase,
  ) { }
  ngOnInit(): void {
    this.getVisibleToSellersTaagerIds();
  }
  getVisibleToSellersTaagerIds(): void {
    this.performAction({
      sourceFormControl: 'visibleToSellers',
      destinationFormControl: 'visibleToSellersTaagerIds',
      destinationAttribute: 'TagerID',
      useCase: this.getUserUseCase,
      errorMessage: 'Error occurred while retreiving visibleToSellers!',
    });
  }
  getVisibleToSellersObjectIds(): void {
    this.performAction({
      sourceFormControl: 'visibleToSellersTaagerIds',
      destinationFormControl: 'visibleToSellers',
      destinationAttribute: '_id',
      useCase: this.getUserByTaagerIdUseCase,
      errorMessage: 'User not found!',
    });
  }
  performAction(params: {
    sourceFormControl: string;
    destinationFormControl: string;
    destinationAttribute: string;
    useCase: UseCase<string, UserModel>;
    errorMessage: string;
  }) {
    const visibleToSellers = [];
    const sourceStringValue =
      this.productsService.productForm.get('productSpecificationForm').get(params.sourceFormControl).value;
      if(sourceStringValue) {
      const ids: string[] =
        sourceStringValue.split(',').map(id => id.trim()).filter(id => id.length) ?? [];
      this.loadingVisibleToSellers = true;
      forkJoin({...ids.map(id => params.useCase.execute(id))}).pipe(finalize(() => {
        this.loadingVisibleToSellers = false;
      })).subscribe((users: {[key: number]: UserModel}) => {
        /* eslint-disable-next-line guard-for-in */
        for (const key in users) {
          visibleToSellers.push(users[key][params.destinationAttribute]);
        }
        this.productsService.productForm.get('productSpecificationForm').get(params.destinationFormControl)
          .setValue(visibleToSellers.join(','));
        this.errorOccurred = false;
      }, () => {
        this.toast.showToast('Error', params.errorMessage);
        this.errorOccurred = true;
      });
    } else {
      this.productsService.productForm.get('productSpecificationForm').get(params.destinationFormControl).setValue('');
    }
  }
}
