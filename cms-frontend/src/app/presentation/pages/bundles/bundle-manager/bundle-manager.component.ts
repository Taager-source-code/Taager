/* eslint-disable @typescript-eslint/naming-convention */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddBundleUseCase } from '@core/usecases/bundles/add-bundle.usecase';
import { EditBundleUseCase } from '@core/usecases/bundles/edit-bundle.usecase';
import { GetBundleByIdUseCase } from '@core/usecases/bundles/get-bundle-by-id.usecase';
import { TrackEventTrackingUseCase } from '@core/usecases/event-tracking/track-event-tracking.usecase';
import { ProductsService } from '@presentation/@core/utils/products.service';
import { ToastService } from '@presentation/@core/utils/toast.service';
import { Subject } from 'rxjs';
import { filter, finalize, takeUntil } from 'rxjs/operators';
import { AddedBundleVariantModel } from './bundle-attributes/bundle-attributes-products/interfaces/interfaces';
import { BundleAttributesOutput } from './bundle-attributes/bundle-attributes.component';
import { formDataToBundleModelSerializer } from './bundle-attributes/helpers/bundle-variant.serializers';
import {
  BundleUISections,
  BundleUISectionsAttributesCategories,
  BundleUISectionsAttributesDetails,
  productVariantGroupDeserializer,
 } from './helpers/product-variant-group.deserializer';
@Component({
  selector: 'ngx-bundle-manager',
  templateUrl: './bundle-manager.component.html',
  styleUrls: ['./bundle-manager.component.scss'],
})
export class BundleManagerComponent implements OnInit, OnDestroy {
  @Output() closeAddBundleDialog$: EventEmitter<any> = new EventEmitter();
  @Input() bundleId: string;
  @Input() selectedCountryPrice: 'EGP' | 'SAR' | 'AED';
  public showFormErrors$: Subject<boolean> = new Subject<boolean>();
  public onDialogClose$: Subject<boolean> = new Subject<boolean>();
  public isGettingBundle: boolean;
  public successGettingBundle: boolean;
  public bundleUISections: BundleUISections;
  private _activeCountry: string;
  private _bundleManagerComponentForm: {[formName: string]: {
    isDirty: boolean;
    values: any;
    isValid: boolean;
  };} = {};
  private _bundlePrimaryVariantId: string;
  constructor(
    private _addBundleUseCase: AddBundleUseCase,
    private _productService: ProductsService,
    private toast: ToastService,
    private trackEventTrackingUseCase: TrackEventTrackingUseCase,
    private _getBundleByIdUseCase: GetBundleByIdUseCase,
    private _editBundleUseCase: EditBundleUseCase,
  ) { }
  ngOnInit(): void {
    this._productService.selectedCountryCodeSubject.subscribe((countryCode) => {
      if(countryCode){
        if(countryCode === 'EGY') {
          this.selectedCountryPrice = 'EGP';
        } else if(countryCode === 'SAU') {
          this.selectedCountryPrice = 'SAR';
        } else {
          this.selectedCountryPrice = 'AED';
        };
      }
    });
    this._getActiveCountry();
    if (this.bundleId) {
      this._getBundle();
    } else {
      this.successGettingBundle = true;
      this._initializeForm();
    }
  }
  ngOnDestroy(): void {
  }
  public onBundleInfoFormGroupChange(event$: FormGroup): void {
    this._bundleManagerComponentForm['info'] = {
      isDirty: this._deepCompareInfoFormChanges(event$.value),
      isValid: event$.valid,
      values: event$.value,
    };
  }
  public onBundleAttributesFormGroupChange(event$: BundleAttributesOutput): void {
    this._bundleManagerComponentForm['attributes'] = {
      isDirty: this._deepCompareAttributesFormChanges(event$),
      isValid: event$.isValid,
      values: event$.bundleAttributes,
    };
  }
  public onDiscardAttempt(): void {
    let formIsDirty = false;
    for (const subForm in this._bundleManagerComponentForm) {
      if (subForm in this._bundleManagerComponentForm) {
        if (this._bundleManagerComponentForm[subForm].isDirty === true) {
          formIsDirty = true;
          break;
        }
      }
    }
    if (formIsDirty) {
      this._showDiscardConfirmation();
    } else {
      this._dismissModal();
    }
  }
  public onSubmitBundleManagerForm(): void {
    const allSubFormsAreValid = this._isCollectiveFormValid();
    if (!allSubFormsAreValid) {
      this.showFormErrors$.next(true);
    } else {
      if (this.bundleId) {
        this._doUpdateBundle();
      } else {
        this._doAddBundle();
      }
    }
  }
  private _doAddBundle(): void {
    this._addBundleUseCase.execute(formDataToBundleModelSerializer(
      this._bundleManagerComponentForm,
      this._activeCountry,
    )).subscribe(success => {
      this.toast.showToast('Success', 'Bundle is added successfully');
      this._dismissModal();
      this.trackEventTrackingUseCase.execute({
        eventName: 'cms_on_add_bundle',
      });
    }, err => {
      this.toast.showToast('Error', err.error?.msg ?? 'An error occurred while adding the bundle!');
    });
  }
  private _doUpdateBundle(): void {
    this._editBundleUseCase.execute(formDataToBundleModelSerializer(
      this._bundleManagerComponentForm,
      this._activeCountry,
      this.bundleId,
      this._bundlePrimaryVariantId,
    )).subscribe(success => {
      this.toast.showToast('Success', 'Bundle is updated successfully');
      this._dismissModal();
      this.trackEventTrackingUseCase.execute({
        eventName: 'cms_on_edit_bundle',
      });
    }, err => {
      this.toast.showToast('Error', err.error?.msg ?? 'An error occurred while updating the bundle!');
    });
  }
  private _getBundle(): void {
    this.isGettingBundle = true;
    this._getBundleByIdUseCase
        .execute(this.bundleId).pipe(
          takeUntil(this.onDialogClose$),
          finalize(() => {
            this.isGettingBundle = false;
          }),
        ).subscribe(bundle => {
          this._bundlePrimaryVariantId = bundle.primaryVariantId;
          this.bundleUISections = productVariantGroupDeserializer(bundle);
          this.successGettingBundle = true;
          this._initializeForm();
        }, err => {
          this.successGettingBundle = false;
          this.toast.showToast('Error', err.error?.msg ?? 'An error occurred while getting the bundle!');
        });
  }
  private _showDiscardConfirmation(): void {
    if (confirm('You have unsaved changes that will be lost when you discard!')) {
      this._dismissModal();
    } else {
    }
  }
  private _isCollectiveFormValid(): boolean {
    let verdict = true;
    for (const subFormKey in this._bundleManagerComponentForm) {
      if (subFormKey in this._bundleManagerComponentForm) {
        if (!this._bundleManagerComponentForm[subFormKey].isValid) {
          verdict = false;
          break;
        }
      }
    }
    return verdict;
  }
  private _initializeForm(): void {
    this._bundleManagerComponentForm = {
      info: {values: {}, isValid: false, isDirty: false},
      attributes: {values: {}, isValid: false, isDirty: false},
    };
  }
  private _getActiveCountry(): void {
    this._productService.selectedCountryCodeSubject.pipe(
        filter(code => code !== undefined),
    ).subscribe(countryCode => {
        this._activeCountry = countryCode;
    });
  }
  private _dismissModal(): void {
    for (const subForm in this._bundleManagerComponentForm) {
      if (subForm in this._bundleManagerComponentForm) {
        this._bundleManagerComponentForm[subForm].isDirty = false;
        this._bundleManagerComponentForm[subForm].isValid = false;
      }
    }
    this.onDialogClose$.next(true);
    this.showFormErrors$.next(false);
    this.closeAddBundleDialog$.emit();
  }
  private _deepCompareInfoFormChanges(newAttributesFormValues: {[control: string]: any}): boolean {
    if (!this.bundleId) {
      return true;
    }
    let verdict = false;
    const initialInfoFormData = this.bundleUISections.info;
    for (const key in initialInfoFormData) {
      if (key in initialInfoFormData) {
        if (newAttributesFormValues[key] !== initialInfoFormData[key]) {
          verdict = true;
          break;
        }
      }
    }
    return verdict;
  }
  private _deepCompareAttributesFormChanges(newAttributesFormValues: BundleAttributesOutput): boolean {
    if (!this.bundleId) {
      return true;
    }
    return this._deepCompareDetailsChanged(newAttributesFormValues.bundleAttributes.details) ||
    this._deepCompareProductsChanged(newAttributesFormValues.bundleAttributes?.products?.products) ||
    this._deepCompareCategoryChanged(newAttributesFormValues.bundleAttributes.category)||
    this._deepCompareImagesChanged(newAttributesFormValues.bundleAttributes.images.bundleImages);
  }
  private _deepCompareDetailsChanged(newDetails: BundleUISectionsAttributesDetails): boolean {
    if (!newDetails) {
      return false;
    }
    return this._deepCompareDetailsSpecificationChanged(newDetails.bundleSpecification) ||
      this._deepCompareDetailsDescriptionChanged(newDetails.bundleDescription) ||
      this._deepCompareVideoLinksChanged(newDetails.bundleVideoLinks);
  }
  private _deepCompareDetailsSpecificationChanged(newSpecification: string): boolean {
    return newSpecification !== this.bundleUISections.attributes.details.bundleSpecification;
  }
  private _deepCompareDetailsDescriptionChanged(newDescription: string): boolean {
    return newDescription !== this.bundleUISections.attributes.details.bundleDescription;
  }
  private _deepCompareVideoLinksChanged(newVideoLinks: Array<string>): boolean {
    const initialVideoLinks = this.bundleUISections.attributes.details.bundleVideoLinks;
    if (newVideoLinks.length !== initialVideoLinks.length) {
      return true;
    }
    return this._commonCompareArrayStringItems(initialVideoLinks, newVideoLinks);
  }
  private _deepCompareProductsChanged(newProductsList: Array<AddedBundleVariantModel>): boolean {
    if (!newProductsList) {
      return false;
    }
    const currentProductsList = this.bundleUISections.attributes.products;
    if (currentProductsList.length !== newProductsList.length) {
      return true;
    }
    let verdict = false;
    const supportedProductAttributes = ['sku', 'quantity', 'arabicName', 'englishName'];
    for (let i=0; i < currentProductsList.length; i++) {
      const currentItemAtIndexI = currentProductsList[i];
      const newItemAtIndexI = newProductsList[i];
      for (const attribute in currentItemAtIndexI) {
        if (attribute in currentItemAtIndexI &&
          attribute in newItemAtIndexI &&
          supportedProductAttributes.indexOf(attribute) !== -1
        ) {
          if (currentItemAtIndexI[attribute] !== newItemAtIndexI[attribute]) {
            verdict = true;
            break;
          }
        }
      }
    }
    return verdict;
  }
  private _deepCompareCategoryChanged(newCategories: BundleUISectionsAttributesCategories): boolean {
    if (!newCategories) {
      return false;
    }
    return this._deepCompareInternalCategoryChanged(newCategories.internalCategoryId)||
    this._deepCompareCommercialCategoryChanged(newCategories.categoryId)||
    this._deepCompareCommercialCategoriesChanged(newCategories.commercialCategoryIds);
  }
  private _deepCompareInternalCategoryChanged(newInternalCategoryId: string): boolean {
    return newInternalCategoryId !== this.bundleUISections.attributes.category.internalCategoryId;
  }
  private _deepCompareCommercialCategoryChanged(newCommercialCategoryId: string): boolean {
    return newCommercialCategoryId !== this.bundleUISections.attributes.category.categoryId;
  }
  private _deepCompareCommercialCategoriesChanged(newCommercialCategoriesId: Array<string>): boolean {
    let verdict = false;
    const initialCommercialCategories =
      this.bundleUISections.attributes.category.commercialCategoryIds;
    if(initialCommercialCategories.length !== newCommercialCategoriesId.length) {
      return true;
    }
    for (let index = 0; index < initialCommercialCategories.length; index++) {
      const newCommercialCategoriesAtSameIndex = newCommercialCategoriesId[index];
      if (newCommercialCategoriesAtSameIndex !== initialCommercialCategories[index]) {
        verdict = true;
        break;
      }
    }
    return verdict;
  }
  private _deepCompareImagesChanged(newImagesList: Array<string>): boolean {
    if (!newImagesList) {
      return false;
    }
    const initialImagesList = this.bundleUISections.attributes.images;
    if (newImagesList.length !== initialImagesList.length) {
      return true;
    }
    return this._commonCompareArrayStringItems(initialImagesList, newImagesList);
  }
  private _commonCompareArrayStringItems(arrA: Array<string>, arrB: Array<string>): boolean {
    let verdict = false;
    for (let index=0; index < arrA.length; index++) {
      if (arrB[index] !== arrA[index]) {
        verdict = true;
        break;
      }
    }
    return verdict;
  }
}
