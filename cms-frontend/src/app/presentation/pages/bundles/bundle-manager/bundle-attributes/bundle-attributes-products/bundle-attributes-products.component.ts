/* eslint-disable quote-props */
/* eslint-disable comma-dangle */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BundleVariantModel } from '@core/domain/bundles/bundle-variant.model';
import { VariantModel } from '@core/domain/variant-group.model';
import { GetVariantUseCase } from '@core/usecases/bundles/get-variant-usecase';
import { BundlesAPIService } from '@data/repositories/bundles/bundles-api.service';
import { ProductsService } from '@presentation/@core/utils/products.service';
import {
    arrayFieldHasRequiredMinLength
} from '@presentation/shared/validators/array-field-has-required-min-length.validator';
import { forkJoin, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import {
    AddedBundleVariantModel,
    BundleAttributesProductsVariant,
    BundleAttributesProductsVariantMode
} from './interfaces/interfaces';
import { BundleAttributesProductsVariantMapper } from './mappers/mappers';

@Component({
    selector: 'ngx-bundle-attributes-products',
    styleUrls: [
        'bundle-attributes-products.component.scss',
    ],
    templateUrl: 'bundle-attributes-products.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BundleAttributesProductsComponent implements OnInit, OnDestroy {
    @Input() initialData: Array<AddedBundleVariantModel>;
    @Input() bundleSavedCountry: string;
    @Input() onDialogClose$: Subject<boolean> = new Subject<boolean>();
    @Output() emitBundleAttributesProductsForm: EventEmitter<FormGroup> = new EventEmitter();
    @Output() emitBundleAttributesProductsCount: EventEmitter<number> = new EventEmitter();
    public isAddingProduct = false;
    public showProductSKUSearchArea = true;
    public addedBundleVariantsList: Array<AddedBundleVariantModel> = [];
    public addedVariantsList: Array<BundleAttributesProductsVariant> = [];
    public currentlyEditingABundleAttribute = false;
    public addVariantInputValue: string;
    public currentVariantBeingEditedInUI: BundleAttributesProductsVariant;

    private _currentSelectedCountryCode: string;
    private _bundleAttributesProductsVariantMapper = new BundleAttributesProductsVariantMapper();

    private _bundleAttributesProductsForm: FormGroup = new FormGroup({
        products: new FormControl(
            [],
            [arrayFieldHasRequiredMinLength({
                formFieldIsEmpty: 'Products list is empty',
            }, 1)]),
    });

    constructor(
        private _productService: ProductsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _getVariantUseCase: GetVariantUseCase,
    ) {}

    ngOnInit(): void {
        this._getSelectedCountryValue();
        this._listenForDialogClose();
        this._optionallyPatchBundleAttributes();
    }

    ngOnDestroy(): void {
        this._resetComponentAttributes();
    }

    public toggleIsAddingProduct(): void {
        this.isAddingProduct = true;
    }

    public onAddVariantInputValueChange(): void {
        this.addVariantInputValue = this.addVariantInputValue.trim();
    }

    public addVariant(): void {
        if (this._productWithSetSKUExistsInSetList()) {
            alert('Product already exists in the list!');
            return;
        }
        if(this.addVariantInputValue && this._currentSelectedCountryCode) {
            this._getVariantUseCase
                .execute({
                    sku: this.addVariantInputValue,
                    country: this._currentSelectedCountryCode
                })
                .subscribe(variant => {
                    const mappedItem = this._bundleAttributesProductsVariantMapper.mapFrom(variant);
                    this.addedVariantsList.push(mappedItem);
                    this.currentlyEditingABundleAttribute = true;
                    this._commonChangeDetectorRef();
                    this.addVariantInputValue = '';
                }, err => {
                    alert(`Ooops, an error occured: ${err.error.description}`);
                });
        } else {
            alert('You must set product SKU!');
        }
    }

    public toggleVariantMode(
        mode: BundleAttributesProductsVariantMode,
        variantUUID: string,
    ): void {
        this._commonPatchVariantAttribute(
            this._commonFindBundleAttributesProductsVariantByVariantUUID(variantUUID),
            'mode',
            mode,
        );
    }

    public updateVariantArabicName(
        variantUUID: string,
        arabicName: string,
    ): void {
        this._commonPatchVariantAttribute(
            this._commonFindBundleAttributesProductsVariantByVariantUUID(variantUUID),
            'arabicName',
            arabicName,
        );
    }

    public updateVariantEnglishName(
        variantUUID: string,
        englishName: string,
    ): void {
        this._commonPatchVariantAttribute(
            this._commonFindBundleAttributesProductsVariantByVariantUUID(variantUUID),
            'englishName',
            englishName,
        );
    }

    public updateVariantQuantity(
        variantUUID: string,
        quantity: number,
        modifier: number,
    ): void {
        if (modifier === -1 && quantity === 1) {
            return;
        }
        quantity += modifier;
        this._commonPatchVariantAttribute(
            this._commonFindBundleAttributesProductsVariantByVariantUUID(variantUUID),
            'quantity',
            quantity,
        );
    }

    public updateVariantQuantityManually(
        variantUUID: string,
        newQuantity: string,
    ): void {
        this._commonPatchVariantAttribute(
            this._commonFindBundleAttributesProductsVariantByVariantUUID(variantUUID),
            'quantity',
            parseInt(newQuantity, 10),
        );
    }

    public saveOrUpdateVariant(
        variant: BundleAttributesProductsVariant,
    ): void {
        this.currentlyEditingABundleAttribute = false;
        this._commonPatchVariantAttribute(variant, 'mode', 'view');
        if (variant.isNew) {
            this.addedBundleVariantsList.push({
                sku: variant.sku,
                quantity: variant.quantity,
                arabicName: variant.arabicName,
                englishName: variant.englishName,
                variantUUID: variant.variantUUID,
            });
            this._commonPatchVariantAttribute(variant, 'isNew', false);
        } else {
            const matchedVariantModel = this._commonFindAddedVariantByVariantUUID(
                variant.variantUUID,
            );
            if (matchedVariantModel) {
                matchedVariantModel.sku = variant.sku;
                matchedVariantModel.quantity = variant.quantity;
                matchedVariantModel.arabicName = variant.arabicName;
                matchedVariantModel.englishName = variant.englishName;
            }
        }
        this._emitBundleAttributesProductForm();
    };

    public updateExistingVariant(
        variant: BundleAttributesProductsVariant,
    ): void {
        this.currentlyEditingABundleAttribute = true;
        this._commonPatchVariantAttribute(variant, 'mode', 'edit');
        this.currentVariantBeingEditedInUI = this._createDeepCopy(variant);
    }

    public discardAddingOrEditingVariant(
        variant: BundleAttributesProductsVariant,
    ): void {
        this.currentlyEditingABundleAttribute = false;
        if (variant.isNew) {
            const matchedVariantIndexUI = this._commonFindItemIndexInList(
                'variantUUID',
                variant.variantUUID,
                this.addedVariantsList,
            );
            if (matchedVariantIndexUI !== -1) {
                this._commonRemoveItemFromListByIndex(
                    matchedVariantIndexUI,
                    this.addedVariantsList,
                );
            }
        } else {
            this._discardUpdatingVariant(variant);
        }
    };

    public removeExistingVariant(
        variantUUID: string,
    ): void {
        const matchVariantInUIIndex = this._commonFindItemIndexInList(
            'variantUUID',
            variantUUID,
            this.addedVariantsList
        );
        if (matchVariantInUIIndex !== -1) {
            this.addedVariantsList.splice(matchVariantInUIIndex, 1);
        }
        const matchVariantInModelIndex = this._commonFindItemIndexInList(
            'variantUUID',
            variantUUID,
            this.addedBundleVariantsList
        );
        if (matchVariantInModelIndex !== -1) {
            this.addedBundleVariantsList.splice(matchVariantInModelIndex, 1);
        }
        this._emitBundleAttributesProductForm();
    }

    private _commonFindItemIndexInList(
        keyAttribute: string,
        keyValue: string,
        list: Array<any>,
    ): number {
        return list.findIndex(item => item[keyAttribute] === keyValue);
    }

    private _commonRemoveItemFromListByIndex(
        index: number,
        list: Array<any>,
    ): void {
        list.splice(index, 1);
    }

    private _emitBundleAttributesProductForm(): void {
        this._bundleAttributesProductsForm.patchValue({
            products: this.addedBundleVariantsList
        });
        this.emitBundleAttributesProductsForm.emit(this._bundleAttributesProductsForm);
        this.emitBundleAttributesProductsCount.emit(
            this._bundleAttributesProductsForm.value.products.length
        );
    }

    private _discardUpdatingVariant(
        variant: BundleAttributesProductsVariant,
    ): void {
        this.currentlyEditingABundleAttribute = false;
        this.addedVariantsList = this.addedVariantsList.map(addedVariantInUI => {
            if (addedVariantInUI.variantUUID === variant.variantUUID) {
                addedVariantInUI = this._createDeepCopy(this.currentVariantBeingEditedInUI);
                this._commonPatchVariantAttribute(addedVariantInUI, 'mode', 'view');
            }
            return addedVariantInUI;
        });
        this.currentVariantBeingEditedInUI = null;
    }

    private _commonFindAddedVariantByVariantUUID(
        variantUUID: string,
    ): AddedBundleVariantModel | null {
        return this.addedBundleVariantsList.find(
            addedBundleVariantItem => addedBundleVariantItem.variantUUID === variantUUID,
        );
    }

    private _commonFindBundleAttributesProductsVariantByVariantUUID(
        variantUUID: string,
    ): BundleAttributesProductsVariant {
        return this.addedVariantsList.find(
            addedVariantItem => addedVariantItem.variantUUID === variantUUID,
        );
    }

    private _commonPatchVariantAttribute(
        variant: AddedBundleVariantModel | BundleAttributesProductsVariant,
        attribute: string,
        value: any,
    ) {
        if (variant) {
            variant[attribute] = value;
        }
    }

    private _productWithSetSKUExistsInSetList(): boolean {
        const productAlreadyExistsInList = this.addedVariantsList.find(
            variant => variant.sku === this.addVariantInputValue,
        );
        return productAlreadyExistsInList ? true : false;
    }

    private _getSelectedCountryValue(): void {
        this._productService.selectedCountryCodeSubject.pipe(
            filter(code => code !== undefined),
        ).subscribe(countryCode => {
            this._currentSelectedCountryCode = countryCode;
        });
    }

    private _resetComponentAttributes(): void {
        this.isAddingProduct = false;
        this.showProductSKUSearchArea = false;
        this._bundleAttributesProductsForm.patchValue({
            products: []
        }, {emitEvent: false});
        this.emitBundleAttributesProductsCount.emit(0);
        this.addedBundleVariantsList = [];
        this.addedVariantsList = [];
        this.currentlyEditingABundleAttribute = false;
        this.addVariantInputValue = '';
        this.currentVariantBeingEditedInUI = null;
        this._commonChangeDetectorRef();
    }

    private _createDeepCopy(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }

    private _commonChangeDetectorRef(): void {
        this._changeDetectorRef.detectChanges();
    }

    private _listenForDialogClose(): void {
        this.onDialogClose$.subscribe(_ => this.ngOnDestroy());
    }

    private _optionallyPatchBundleAttributes(): void {
        if (this.initialData) {
            const productsVariantsSKUsList: Observable<VariantModel>[] = [];
            const productsVariantsHashMap: {[sku: string]: BundleVariantModel} = {};
            this.initialData.map(bundleVariant => {
                productsVariantsSKUsList.push(this._getVariantUseCase.execute({
                    sku: bundleVariant.sku,
                    country: this.bundleSavedCountry,
                }));
                productsVariantsHashMap[bundleVariant.sku] = {
                    sku: bundleVariant.sku,
                    quantity: bundleVariant.quantity,
                    arabicName: bundleVariant.arabicName,
                    englishName: bundleVariant.englishName,
                };
            });
            forkJoin(productsVariantsSKUsList)
                .pipe(
                    takeUntil(this.onDialogClose$)
                )
                .subscribe((productUIVariantsList: VariantModel[]) => {
                    const addedVariantsList = [];
                    const addedBundleVariantsList: Array<AddedBundleVariantModel> = [];
                    for (const productUIVariant of productUIVariantsList) {
                        const mappedItem = this._bundleAttributesProductsVariantMapper.mapFrom(productUIVariant);
                        mappedItem.sku = productsVariantsHashMap[productUIVariant.productId].sku;
                        mappedItem.quantity = productsVariantsHashMap[productUIVariant.productId].quantity;
                        mappedItem.arabicName = productsVariantsHashMap[productUIVariant.productId].arabicName || '';
                        mappedItem.englishName = productsVariantsHashMap[productUIVariant.productId].englishName || '';
                        mappedItem.mode = 'view';
                        mappedItem.isNew = false;
                        addedVariantsList.push(mappedItem);
                        addedBundleVariantsList.push({
                            variantUUID: mappedItem.variantUUID,
                            sku: mappedItem.sku,
                            quantity: mappedItem.quantity,
                            arabicName: productsVariantsHashMap[productUIVariant.productId].arabicName,
                            englishName: productsVariantsHashMap[productUIVariant.productId].englishName,
                        });
                    }
                    this.addedVariantsList = addedVariantsList;
                    this.addedBundleVariantsList = addedBundleVariantsList;
                    this.isAddingProduct = true;
                    this._commonChangeDetectorRef();
                    this._emitBundleAttributesProductForm();
                });
        }
    }
}
