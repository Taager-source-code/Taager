import { Mapper } from '@core/base/mapper';
import { VariantModel } from '@core/domain/variant-group.model';
import {
    availabilityFilterFormatter,
} from '@presentation/pages/bundles/shared/pipes/availability-filter-dropdown.pipe';
import { throwError } from 'rxjs';
import { BundleAttributesProductsVariant, BundleAttributesProductsVariantTypes } from '../interfaces/interfaces';
export class BundleAttributesProductsVariantMapper extends Mapper<VariantModel, BundleAttributesProductsVariant> {
    mapFrom(param: VariantModel): BundleAttributesProductsVariant {
        const attributes: Array<{type: string; value: any}> = param.attributes;
        const attributesMap: {[attribute: string]: Array<any>} = {};
        for (const attribute of attributes) {
            if (!attributesMap[attribute.type]) {
                attributesMap[attribute.type] = [];
            }
            attributesMap[attribute.type].push(attribute.value);
        }
        let variants: BundleAttributesProductsVariantTypes = {};
        for (const key in attributesMap) {
            if (key in attributesMap) {
                const splitKey = key.split('');
                let newKey = '';
                splitKey.forEach(char => {
                    if (char === char.toLocaleLowerCase()) {
                        newKey += char;
                    } else {
                        newKey += ` ${char.toLocaleLowerCase()}`;
                    }
                });
                let formattedKey = '';
                if (newKey.includes(' ')) {
                    const splitNewKey = newKey.split(' ');
                    splitNewKey.forEach(keyPart => {
                        formattedKey += `${keyPart.charAt(0).toUpperCase() + keyPart.split('').splice(1).join('')} `;
                    });
                    formattedKey = formattedKey.trim();
                } else {
                    formattedKey = newKey.charAt(0).toUpperCase() + newKey.split('').splice(1).join('');
                }
                variants[key] = {
                    label: formattedKey,
                    values: attributesMap[key],
                };
            }
        }
        if (Object.keys(variants).length === 0) {
            variants = null;
        }
        return {
            productName: param.productName,
            productPicture: param.variantImages[0],
            variants,
            variantUUID: param._id,
            mode: 'edit',
            productAvailability: {
                value: param.productAvailability.split('_').join('-'),
                label: availabilityFilterFormatter(
                    param.productAvailability,
                    ((val: string) => val.split('_').join(' ').replace('qty', 'quantity')),
                ),
            },
            sku: param.productId,
            quantity: 1,
            arabicName: '',
            englishName: '',
            isNew: true,
        };
    }
    mapTo(param: BundleAttributesProductsVariant): any {
        return throwError('not implemented');
    }
}
