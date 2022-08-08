import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { FormGroup } from '@angular/forms';

/**

 * This is a shared component for displaying error responses alongside a

 * form field.

 */

@Component({

    selector: 'app-form-field-error',

    styleUrls: [

        'form-field-error.component.scss'

    ],

    templateUrl: 'form-field-error.component.html',

    changeDetection: ChangeDetectionStrategy.OnPush

})

export class FormFieldErrorComponent implements OnChanges {

    @Input() showErrors: boolean;

    @Input() form: FormGroup;

    @Input() controlName: string;

    @Input() errorMapping: {[field: string]: {[errorResponse: string]: string}};

    public formFieldErrors: Array<string>;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {

        if (changes.showErrors?.currentValue) {

            this.updateFormErrors();

            this.listenForFormChanges();

        }

    }

    private listenForFormChanges(): void {

        this.form.statusChanges.subscribe(s => {

            this.updateFormErrors();

        });

    }

    private updateFormErrors(): void {

        if (this.form && this.controlName && this.form.get(this.controlName)) {

            this.computeFormErrors(this.form.get(this.controlName).errors, this.form.errors);

        }

    }

    private computeFormErrors(

        fieldErrorsObject: {[error: string]: boolean},

        crossFormErrors: {[error: string]: boolean} = {}

    ): void {

        const errors: Array<string> = [];

        const combinedErrors = { ...crossFormErrors, ...fieldErrorsObject };

        for (const key in combinedErrors) {

            if(combinedErrors[key]) {

                errors.push(key);

            }

        }

        this.formFieldErrors = errors;

    }

}
