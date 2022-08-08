import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { BundleUISectionsAttributes } from '../helpers/product-variant-group.deserializer';
export interface BundleAttributesOutput {
  isValid: boolean;
  bundleAttributes: {[subForm: string]: any};
}
@Component({
  selector: 'ngx-bundle-attributes',
  templateUrl: './bundle-attributes.component.html',
  styleUrls: ['./bundle-attributes.component.scss'],
})
export class BundleAttributesComponent implements OnInit {
  @Input() bundleSavedCountry: string;
  @Input() initialData: BundleUISectionsAttributes;
  @Input() showFormErrors$: Subject<boolean> = new Subject<boolean>();
  @Input() onDialogClose$: Subject<boolean> = new Subject<boolean>();
  @Output() bundleAttributesFormGroupChange: EventEmitter<BundleAttributesOutput> = new EventEmitter();
  public productsCount = 0;
  public detailsTabIsInValid = true;
  public productsTabIsInValid = true;
  public categoryTabIsInValid = true;
  public imagesTabIsInValid = true;
  private _bundleAttributesComponentForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }
  ngOnInit(): void {
    this._initializeForm();
  }
  public resolveBundleAttributesDetailsForm($event: FormGroup) {
    this.detailsTabIsInValid = $event.invalid;
    this._commonPatchFormField('details', $event);
  }
  public resolveBundleAttributesProductsForm($event: FormGroup): void {
    this.productsTabIsInValid = $event.invalid;
    this._commonPatchFormField('products', $event);
  }
  public resolveBundleAttributesProductsCount($event: number): void {
    this.productsCount = $event;
    this._commonChangeDetector();
  }
  public resolveBundleAttributesCategoryForm($event: FormGroup) {
    this.categoryTabIsInValid = $event.invalid;
    this._commonPatchFormField('category', $event);
  }
  public resolveBundleAttributesImagesForm($event: FormGroup) {
    this.imagesTabIsInValid = $event.invalid;
    this._commonPatchFormField('images', $event);
  }
  private _initializeForm(): void {
    this._bundleAttributesComponentForm = this._formBuilder.group({
      details: [],
      products: [],
      category: [],
      images: [],
    });
  }
  private _commonPatchFormField(
    subForm: string,
    value: FormGroup,
  ): void {
    this._bundleAttributesComponentForm.patchValue({
      [subForm]: value,
    });
    this._emitBundleAttributesComponentForm();
  }
  private _emitBundleAttributesComponentForm(): void {
    const emitMeta: BundleAttributesOutput = {
      isValid: this._areAllBundleAttributeFormsValid(),
      bundleAttributes: this._recursiveGetNestedFormValues(),
    };
    this.bundleAttributesFormGroupChange.emit(emitMeta);
  }
  private _areAllBundleAttributeFormsValid(): boolean {
    let allSubFormsAreValid = true;
    if (this.detailsTabIsInValid || this.productsTabIsInValid || this.categoryTabIsInValid || this.imagesTabIsInValid) {
      allSubFormsAreValid = false;
    }
    for (const subForm in this._bundleAttributesComponentForm.controls) {
      if (subForm in this._bundleAttributesComponentForm.controls) {
        const subFormAsFormGroup = this._bundleAttributesComponentForm.controls[subForm] as FormGroup;
        if (subFormAsFormGroup.value) {
          for (const subFormField in subFormAsFormGroup.value.controls) {
            if (subFormField in subFormAsFormGroup.value.controls) {
              const subFormFieldControl = subFormAsFormGroup.value.get(subFormField);
              if (subFormAsFormGroup && subFormFieldControl.invalid) {
                allSubFormsAreValid = false;
              }
            }
          }
        }
      }
    }
    return allSubFormsAreValid;
  }
  private _recursiveGetNestedFormValues(): {[subForm: string]: any} {
    const values: {[subForm: string]: any} = {};
    for (const subForm in this._bundleAttributesComponentForm.controls) {
      if (subForm in this._bundleAttributesComponentForm.controls) {
        const subFormAsFormGroup = this._bundleAttributesComponentForm.controls[subForm] as FormGroup;
        if (subFormAsFormGroup.value) {
          values[subForm] = {};
          for (const subFormControl in subFormAsFormGroup.value.controls) {
            if (subFormControl in subFormAsFormGroup.value.controls) {
              values[subForm][subFormControl] = subFormAsFormGroup.value.get(subFormControl).value;
            }
          }
        }
      }
    }
    return values;
  }
  private _commonChangeDetector(): void {
    this._changeDetectorRef.detectChanges();
  }
}
