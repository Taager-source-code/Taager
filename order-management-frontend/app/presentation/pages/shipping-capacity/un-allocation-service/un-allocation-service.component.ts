import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { finalize } from 'rxjs/operators';
import { UnAllocationModel } from '../../../../core/domain/unAllocationService';
import { UpdateUnAllocationServiceStatusUseCase }
from '../../../../core/usecases/unAllocation-service/upload-orders.usecase';
import { ORDER_COLUMN_NAME, UNALLOCATE_FILE_NAME } from '../../../../data/constants/unAllocateFile';
import { FileUtilityService } from '../../../@core/utils/fileUtility.service';
import { LoaderService } from '../../../@core/utils/loader.service';
import { MyToastService } from '../../../@core/utils/myToast.service';
@Component({
  selector: 'un-allocation-service',
  templateUrl: './un-allocation-service.component.html',
  styleUrls: ['./un-allocation-service.component.scss'],
})
export class UnAllocationServiceComponent implements OnInit {
  @ViewChild('unAllocationUpload') unAllocationUpload: UploaderComponent;
  @Output() public closeSideBar = new EventEmitter<any>();
  fileData: UnAllocationModel[] = [];
  constructor(
    private toastService: MyToastService,
    private updateUnAllocationServiceStatusUseCase: UpdateUnAllocationServiceStatusUseCase,
    private loaderService: LoaderService,
    private fileService: FileUtilityService,
  ) { }
  ngOnInit(): void {
  }
  onFileSelect(event: HTMLInputElement) {
    const files = event.files;
    if (files && files.length) {
      const fileToRead = files[0];
      const fr = new FileReader();
      fr.readAsText(fileToRead);
      fr.onload = (e) => {
        const content = e.target.result.toString();
        const lines = content.split('\n').filter((line) => line.trim());
        const headers = lines[0].split(',');
        if (headers.length === 1) {
          this.loaderService.showSpinner();
          for (let indx = 1; indx < lines.length; indx++) {
            const element = lines[indx];
            const [orderId] = element
              .replace(/\r/g, '')
              .split(',');
            this.fileData.push({ orderId });
          }
          this.uploadOrdersForUnAllocation();
        } else {
          this.unAllocationUpload.clearAll();
          this.toastService.showToast('Error', 'Invalid File.', 'error');
        }
      };
    }
  }
  uploadOrdersForUnAllocation(): void {
    this.updateUnAllocationServiceStatusUseCase.execute(this.fileData).pipe(finalize(() => {
      this.loaderService.hideSpinner();
    })).subscribe(
      (res: any) => {
        this.toastService.showToast('Success', res.msg, 'success');
        this.unAllocationUpload.clearAll();
        this.closeSideBar.emit();
      },
      (err) => {
        this.toastService.showToast('Error', err.error?.message, 'error');
      },
      () => { },
    );
  }
  downloadOrderSheet(){
    const data = [
      {
        orderId: '',
      },
    ];
    const filename = UNALLOCATE_FILE_NAME;
    this.fileService.downloadFile(data, filename, ORDER_COLUMN_NAME);
  }
}
