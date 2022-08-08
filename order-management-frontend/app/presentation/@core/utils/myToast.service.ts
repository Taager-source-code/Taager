/* eslint-disable */ 
import { Injectable } from '@angular/core';
import { ToastUtility } from '@syncfusion/ej2-angular-notifications';
@Injectable({
  providedIn: 'root',
})
export class MyToastService {
    toastObj;
    showToast(title: string, content: string, type?: 'success' | 'error' | 'info' | 'warning'){
      this.toastObj  = ToastUtility.show({
            title,
            content,
            timeOut: 5000,
            position: { X: 'Right', Y: 'Top' },
            showCloseButton: false,
            click: this.toastClose.bind(this),
            target: 'nb-layout-column',
            cssClass: type?'toast-'+type+' toast-top-set':'toast-top-set'
            // buttons:  [{
            //     model: { content: 'Close' }, click: this.toastClose.bind(this)
            // }]
        });
    }
    public toastClose(): void {
        this.toastObj.hide();
    }
}
