import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { GetAllocationServiceStatusUseCase }
  from '../../../../core/usecases/allocation-service/get-allocation-service-status.usecase';
import { RunAllocationServicesUseCase }
  from '../../../../core/usecases/allocation-service/run-allocation-service.usecase';
import { UpdateAllocationServiceStatusUseCase }
  from '../../../../core/usecases/allocation-service/update-allocation-service-status.usecase';
import { LoaderService } from '../../../@core/utils/loader.service';
import { MyToastService } from '../../../@core/utils/myToast.service';
@Component({
  selector: 'allocation-service',
  templateUrl: './allocation-service.component.html',
  styleUrls: ['./allocation-service.component.scss'],
})
export class AllocationServiceComponent {
  serviceStatus: string;
  toggleStatus: boolean;
  constructor(
    private getAllocationServiceStatusUseCase: GetAllocationServiceStatusUseCase,
    private runAllocationServiceUseCase: RunAllocationServicesUseCase,
    private updateAllocationServiceUseCase: UpdateAllocationServiceStatusUseCase,
    private toastrService: MyToastService,
    private loaderService: LoaderService,
  ) { }
  getServiceStatus(): void {
    this.loaderService.showSpinner();
    this.getAllocationServiceStatusUseCase.execute().pipe(finalize(() => {
      this.loaderService.hideSpinner();
    })).subscribe(
      (response) => {
        this.serviceStatus = response.status;
      },
      (err) => {
        this.loaderService.hideSpinner();
        console.log(err);
      },
      () => {
        this.setToggleType();
      },
    );
  }
  setToggleType() {
    this.toggleStatus = this.serviceStatus === 'enabled' ? true : false;
  }
  setServiceType() {
    this.serviceStatus = this.toggleStatus === true ? 'enabled' : 'disabled';
  }
  runAllocationService() {
    this.loaderService.showSpinner();
    this.runAllocationServiceUseCase.execute().pipe(finalize(() => {
      this.loaderService.hideSpinner();
    })).subscribe(
      (response) => {
        this.toastrService.showToast('Successful', 'Allocation service run successfully.', 'success');
      },
      (err) => {
        console.log(err);
        this.loaderService.hideSpinner();
        this.toastrService.showToast('Error', err.error?.error, 'error');
      },
      () => { },
    );
  }
  updateAllocationServiceStatus() {
    this.loaderService.showSpinner();
    this.setServiceType();
    const params = {
      status: this.serviceStatus,
    };
    this.updateAllocationServiceUseCase.execute(params).pipe(finalize(() => {
      this.loaderService.hideSpinner();
    })).subscribe(
      (response) => {
        this.toastrService.showToast('Status Updated', 'Allocation Service is ' + this.serviceStatus, 'info');
      },
      (err) => {
        console.log(err);
        this.loaderService.hideSpinner();
      },
      () => { },
    );
  }
}
