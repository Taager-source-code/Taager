import { Injectable } from '@angular/core';
import { ToastUtility } from '@syncfusion/ej2-angular-notifications';
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toastObj;
  showToast(
    title: 'Success' | 'Error' | 'Info',
    content: string,
  ){
    const toastTypeClass = `toast-${title.toLowerCase()}`;
    this.toastObj  = ToastUtility.show({
      title,
      content,
      timeOut: 5000,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      position: { X: 'Right', Y: 'Top' },
      showCloseButton: false,
      click: this.toastClose.bind(this),
      target: 'html',
      cssClass: 'custom-toast ' + toastTypeClass,
    });
  }
  public toastClose(): void {
    this.toastObj.hide();
  }
}
