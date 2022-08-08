/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable arrow-body-style */
import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
/**
 * validator to check if an array field has the required min length
 */
export function arrayFieldHasRequiredMinLength(
    customError: {[errorField: string]: string},
    requiredLength: number,
): ValidatorFn {
    return (arrayFormControl: FormControl): ValidationErrors | null => {
        return arrayFormControl.value?.length < requiredLength ? customError : null;
    };
}
