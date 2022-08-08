import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    constructor(private spinner: NgxSpinnerService) {
    }
    showSpinner() {
        this.spinner.show(undefined,
            {
                type: 'square-jelly-box',
                size: 'medium',
                bdColor: 'rgba(0,0,0, .25)',
                color: '#13aca0',
                fullScreen: false,
            },
        );
    }
    hideSpinner() {
        this.spinner.hide();
    }
}
