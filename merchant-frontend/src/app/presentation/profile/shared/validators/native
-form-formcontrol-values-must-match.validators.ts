import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * validator to ensure that N form field values must have the same value.
 *
 * this will make it possible to have a dynamic validator for fields which
 * need to match for the form to be a valid one.
 *
 * case in point - confirming passwords, the two passwords must match
 *
 * this will match native types, like numbers and strings, where there is room
 * for one to one comprisons
 */
const nativeFormControlValuesMustMatchValidator = (
    fieldsThatMustMatch: Array<string>
) => (control: AbstractControl): ValidationErrors | null => {
    let fieldsThatMustMatchDoMatch = false;
    let anyMatchingFieldIsDirty = false;
    /* eslint-disable @typescript-eslint/prefer-for-of */
    for (let i=0; i < fieldsThatMustMatch.length; i++) {
        if (control.get(fieldsThatMustMatch[i]).dirty) {
            anyMatchingFieldIsDirty = true;
            break;
        }
    }
    if (anyMatchingFieldIsDirty) {
        fieldsThatMustMatchDoMatch = recursiveCheckValuesForMatching(
            fieldsThatMustMatch,
            control,
        );
        return !fieldsThatMustMatchDoMatch ? { fieldsThatMustMatchDoMatchError: !fieldsThatMustMatchDoMatch } : null;
    }
    return null;
};

const recursiveCheckValuesForMatching = (
    fields: Array<string>,
    control: AbstractControl,
    iteration: number = 1,
    verdict: boolean = true,
    matchValue: any | null = null,
): boolean => {
    if (!control.dirty) {
        return true;
    }
    while(fields.length !== iteration) {
        if (!matchValue) {
            matchValue = control.get(fields[0]).value;
        }
        if (matchValue !== control.get(fields[iteration]).value) {
            verdict = false;
            break;
        }
        return recursiveCheckValuesForMatching(fields, control, iteration + 1, verdict, matchValue);
    }
    return verdict;
};

export default nativeFormControlValuesMustMatchValidator;


