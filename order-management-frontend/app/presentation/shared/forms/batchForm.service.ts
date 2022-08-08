import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LoaderService } from '../../@core/utils/loader.service';
import { MyToastService } from '../../@core/utils/myToast.service';
import { tableSettings } from '../../@core/utils/table-settings';
import { BatchAPIService } from '../../services/batch.service';
import { CommonAPIService } from '../../services/common.service';
import { MultitenancyService } from '../../services/multitenancy.service';
import { finalize } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class BatchForm {
  shippingCompanyList;
  batchList;
  batchForm: FormGroup;
  searchFormGroup: FormGroup;
  public batchList$;
  private myBatchList = new BehaviorSubject<any>('');
  constructor(
    private fb: FormBuilder,
    private batchApi: BatchAPIService,
    private toastService: MyToastService,
    private multitenancyService: MultitenancyService,
    private commonAPI: CommonAPIService,
    private loaderService: LoaderService,
  ) {
    this.batchList$ = this.myBatchList.asObservable();
  }
  public init(batch?) {
    const data = { ...batch };
    this.batchForm = this.fb.group({
      id: [data.id],
      batchCategory: [data ? data.batchCategory : '', [Validators.required]],
      batchQuantity: [data ? data.batchQuantity : '', [Validators.required]],
      shippingCompany: [data ? data.shippingCompany : '', [Validators.required]],
      province: [data ? data.province : '', [Validators.required]],
      zone: [data ? data.zone : ''],
      cap: [data ? data.cap : 0, [Validators.required]],
      warehouse: [data ? data.warehouse : '', [Validators.required]],
    });
  }
  fetchBatch() {
    const params = this.searchFormGroup.value;
    const filteredParams = Object.keys(params)
      .filter(key => params[key])
      .reduce((resultObject, key) => {
        resultObject[key] = params[key];
        return resultObject;
      }, {});
    this.loaderService.showSpinner();
    this.commonAPI.getBatches(filteredParams).pipe(finalize(() => {
      this.loaderService.hideSpinner();
    })).subscribe(
      (res) => {
        this.batchList = res.batches;
        this.myBatchList.next({batchList: this.batchList, count: res.count});
        this.shippingCompanyList = [...new Set(this.batchList.map(item => item.shipping.company))];
      },
      (err) => {
        this.toastService.showToast('Error', err.error?.msg, 'error');
      },
      () => { },
    );
  }
  async createBatch(data) {
    this.loaderService.showSpinner();
    try {
      await this.batchApi.createBatch(data).toPromise();
      this.toastService.showToast('Success', 'Batch Added Successfully');
      this.fetchBatch();
      this.batchForm.reset();
      this.loaderService.hideSpinner();
    } catch (e) {
      this.toastService.showToast('Error', e.error?.msg);
      this.loaderService.hideSpinner();
      throw e;
    }
  }
  searchFiltersInit() {
    this.searchFormGroup = this.fb.group({
      batchId: null,
      orderId: null,
      pageSize: tableSettings.pageSettings.pageSize,
      page: 1,
      category: null,
      status: null,
      grouping: null,
      company: null,
      province: null,
      country: this.multitenancyService.selectedCountry?.countryIsoCode3,
      downloadStatus: null,
    });
  }
  updateCountry() {
    this.searchFiltersInit();
    this.fetchBatch();
  }
  async deleteBatch(batchId) {
    try {
      await this.batchApi.deleteBatch(batchId).toPromise();
      this.fetchBatch();
    } catch (e) {
      this.toastService.showToast('Error', e.error?.msg);
      throw e;
    }
  }
}
