import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryModel } from '@core/domain/country.model';
import { CustomerModel, OrderDetailsModel, ShippingModel } from '@core/domain/order.model';
import { AFTER_SALES_REQUESTS } from '@data/constants/after-sales-requests';
import { ProvinceModel } from '@core/domain/province.model';
import { GetProvincesUseCase } from '@core/usecases/province/get-provinces.usecase';
import { LoaderService } from '@presentation/@core/utils/loader.service';
import { MyToastService } from '@presentation/@core/utils/myToast.service';
@Component({
  selector: 'ngx-create-after-sales',
  templateUrl: './create-after-sales.component.html',
  styleUrls: ['./create-after-sales.component.scss'],
})
export class CreateAfterSalesComponent implements OnInit, OnChanges {
  @Input() orderLine: OrderDetailsModel;
  @Input() selectedCountry: CountryModel;
  @Input() customerDetails: CustomerModel;
  @Input() shippingDetails: ShippingModel;
  @Output() cancelClicked = new EventEmitter<void>();
  afterSaleRequestsDetailsForm: FormGroup;
  afterSalesRequestTypes = [];
  provinces: ProvinceModel[];
  orderProvinceZones: string[];
  constructor(
    private _getProvincesUseCase: GetProvincesUseCase,
    private _loaderService: LoaderService,
    private _toastService: MyToastService,
  ) { }
  ngOnInit(): void {
    this.afterSalesRequestTypes = [
      {option: 'Refund', value: AFTER_SALES_REQUESTS.REFUND},
      {option: 'Replacement', value: AFTER_SALES_REQUESTS.REPLACEMENT},
      {option: 'Addition', value: AFTER_SALES_REQUESTS.ADDITION},
    ];
  }
  ngOnChanges(): void {
    this._loaderService.showSpinner();
    this._getProvincesUseCase.execute(this.selectedCountry.isoCode3).subscribe(provinces => {
      this.provinces = provinces;
      this.initializeAfterSaleRequestForm();
      this.orderProvinceZones =
        this.provinces?.filter(province => province.location === this.shippingDetails.province)[0]?.greenZones || [];
      this._loaderService.hideSpinner();
      }, err => {
        this._toastService.showToast('Error', err?.msg || 'Error fetching provinces and zones', 'error');
      });
    }
    initializeAfterSaleRequestForm(): void {
    this.afterSaleRequestsDetailsForm = new FormGroup({
      type: new FormControl(null, Validators.required),
      quantity: new FormControl(0,
        [Validators.required, Validators.min(1), Validators.max(this.orderLine?.quantity || 1)]),
      addShippingCost: new FormControl(false),
      editInfo: new FormControl(false),
      customerName: new FormControl(
        {value: this.customerDetails?.customerName || '', disabled: true}, Validators.required),
      phoneNumber: new FormControl(
        {value: this.customerDetails?.customerPhoneNum1 || '', disabled: true}, Validators.required),
      province: new FormControl(
        {value: this.shippingDetails?.province || null, disabled: true}, Validators.required),
      zone: new FormControl(
        {value: this.shippingDetails?.zone?.name || null, disabled: true}, Validators.required),
      address: new FormControl(
        {value: this.shippingDetails?.address?.streetName || '', disabled: true}, Validators.required),
      replacementSKUs: new FormArray([
        new FormGroup({
          SKU: new FormControl(this.orderLine.productId, Validators.required),
          quantity: new FormControl(0, Validators.min(1)),
        }),
      ]),
    });
  }
  toggleEditInfo(): void {
    const changeableFields = [
      'customerName',
      'phoneNumber',
      'address',
      'zone',
    ];
    if(this.afterSaleRequestsDetailsForm.get('editInfo').value) {
      changeableFields.forEach(fieldName => {
        this.afterSaleRequestsDetailsForm.get(fieldName).enable();
      });
    } else {
      changeableFields.forEach(fieldName => {
        this.afterSaleRequestsDetailsForm.get(fieldName).disable();
      });
      this.afterSaleRequestsDetailsForm.get('customerName').setValue(this.customerDetails?.customerName || '');
      this.afterSaleRequestsDetailsForm.get('phoneNumber').setValue(this.customerDetails?.customerPhoneNum1 || '');
      this.afterSaleRequestsDetailsForm.get('address').setValue(this.shippingDetails?.address?.streetName || '');
      this.afterSaleRequestsDetailsForm.get('zone').setValue(this.shippingDetails?.zone?.name || '');
    }
  }
  onCreateAfterSaleRequest(): void {
    const data = {
      requestType: this.afterSaleRequestsDetailsForm.get('type').value,
      quantity: this.afterSaleRequestsDetailsForm.get('quantity').value,
      addShippingCost: this.afterSaleRequestsDetailsForm.get('addShippingCost').value,
      customerName: this.afterSaleRequestsDetailsForm.get('customerName').value,
      phoneNumber: this.afterSaleRequestsDetailsForm.get('phoneNumber').value,
      province: this.afterSaleRequestsDetailsForm.get('province').value,
      address: this.afterSaleRequestsDetailsForm.get('address').value,
      replacementSKUs: this.afterSaleRequestsDetailsForm.get('replacementSKUs').value,
    };
  }
  onCancelButtonClicked(): void {
    this.cancelClicked.emit();
  }
  onRequestTypeChanged(): void {
    if(this.afterSaleRequestsDetailsForm.get('type').value === AFTER_SALES_REQUESTS.REPLACEMENT) {
      this.afterSaleRequestsDetailsForm.get('replacementSKUs').enable();
    } else {
      this.afterSaleRequestsDetailsForm.get('replacementSKUs').disable();
    }
  }
  onAddReplacementSKU(): void {
    (this.afterSaleRequestsDetailsForm.get('replacementSKUs') as FormArray).push(
      new FormGroup({
        SKU: new FormControl('', Validators.required),
        quantity: new FormControl('', Validators.required),
      }),
    );
  }
  onDeleteReplacementSKUFields(index): void {
    (this.afterSaleRequestsDetailsForm.get('replacementSKUs') as FormArray).removeAt(index);
  }
}
