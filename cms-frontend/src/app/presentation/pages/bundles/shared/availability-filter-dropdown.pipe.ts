/* eslint-disable @typescript-eslint/ban-types */
import { Pipe, PipeTransform } from '@angular/core';
/**
 * This filter will receive an availability filter by code and then return
 * the formatted version of the same.
 *
 * For example:
 *
 * Input -> not_available
 * Output -> Not Available
 */
@Pipe({
    name: 'ngxAvailabilityFilterFormatter',
})
export class AvailabilityFilterFormatter implements PipeTransform {
    transform(filterCode: string, operation: Function): string {
        return availabilityFilterFormatter(filterCode, operation);
    }
};
export const availabilityFilterFormatter = (
    filterCode: string,
    operation: Function,
): string => operation(filterCode);
