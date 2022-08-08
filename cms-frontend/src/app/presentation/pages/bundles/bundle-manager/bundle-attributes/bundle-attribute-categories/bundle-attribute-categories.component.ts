/* eslint-disable max-len */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  arrayFieldHasRequiredMinLength,
} from '@presentation/shared/validators/array-field-has-required-min-length.validator';
import { Subject } from 'rxjs';
import { BundleUISectionsAttributesCategories } from '../../helpers/product-variant-group.deserializer';
import { BundleAttributeCommercialCategoriesComponent } from './bundle-attribute-commercial-categories/bundle-attribute-commercial-categories.component';
import { BundleAttributeInternalCategoriesComponent } from './bundle-attribute-internal-categories/bundle-attribute-internal-categories.component';
@Component({
  selector: 'ngx-bundle-attribute-categories',
  templateUrl: './bundle-attribute-categories.component.html',
  styleUrls: ['./bundle-attribute-categories.component.scss'],
})
export class BundleAttributeCategoriesComponent implements OnInit, OnDestroy {
  @Input() onDialogClose$: Subject<boolean> = new Subject<boolean>();
  @Input() showFormErrors$: Subject<boolean> = new Subject<boolean>();
  @Input() initialData: BundleUISectionsAttributesCategories;
  @Output() emitBundleAttributesCategoryForm: EventEmitter<FormGroup> = new EventEmitter();
  @ViewChild(BundleAttributeCommercialCategoriesComponent, {static: false})
  private _bundleAttributeCommercialCategoriesComponent: BundleAttributeCommercialCategoriesComponent;
  @ViewChild(BundleAttributeInternalCategoriesComponent, {static: false})
  private _bundleAttributeInternalCategoriesComponent: BundleAttributeInternalCategoriesComponent;
  private _bundleAttributesCategoriesForm: FormGroup = new FormGroup({
    internalCategoryId: new FormControl('', [Validators.required]),
    commercialCategoryIds: new FormControl(
      [],
      [arrayFieldHasRequiredMinLength({
        formFieldIsEmpty: 'Commercial category ids are required',
      }, 1)]),
    categoryId: new FormControl('', [Validators.required]),
  });
  private _priorityMapping: {[level: string]: number} = {
    commercialCategoriesLevelOne: 1,
    commercialCategoriesLevelTwo: 2,
    commercialCategoriesLevelThree: 3,
    commercialCategoriesLevelFour: 4,
  };
  constructor() { }
  ngOnInit(): void {
    this._listenForDialogClose();
  }
  ngOnDestroy(): void {
    this._bundleAttributesCategoriesForm.reset(undefined, {emitEvent: false});
    this._bundleAttributeCommercialCategoriesComponent.ngOnDestroy();
    this._bundleAttributeInternalCategoriesComponent.ngOnDestroy();
  }
  public resolveBundleAttributesInternalCategoriesForm($event: FormGroup) {
    if ($event.valid) {
      this._commonPatchFormValue({ internalCategoryId: $event.value.internalCategoryLevelThree });
    } else {
      this._commonPatchFormValue({ internalCategoryId: null });
    }
    this._emitBundleAttributesMetaData();
  }
  public resolveBundleAttributesCommercialCategoriesForm($event: FormGroup) {
    const formValues = $event.value;
    if ($event.valid) {
      this._commonPatchFormValue({ categoryId: formValues.commercialCategories });
      const commercialCategoryIds = this._returnCommercialCategoryIds(
        formValues.commercialCategoriesFormGroupArray,
      );
      this._commonPatchFormValue({ commercialCategoryIds });
    } else {
      if (formValues.commercialCategories === '' || !formValues.commercialCategories) {
        this._commonPatchFormValue({ commercialCategories: null });
      }
      if (formValues.commercialCategoriesFormGroupArray.length === 0 || !formValues.commercialCategoriesFormGroupArray) {
        this._commonPatchFormValue({ commercialCategoriesFormGroupArray: null });
      }
    }
    this._emitBundleAttributesMetaData();
  }
  private _listenForDialogClose(): void {
    this.onDialogClose$.subscribe(_ => this.ngOnDestroy());
  }
  private _commonPatchFormValue(patchValue: { [formControl: string]: any }): void {
    this._bundleAttributesCategoriesForm.patchValue(patchValue);
  }
  private _returnCommercialCategoryIds(formGroupArray: Array<{[level: string]: string}>): Array<string> {
    const res: Array<string> = [];
    formGroupArray.forEach(formGroup => {
      const formGroupPriorityList: Array<{
        priority: number;
        value: string;
      }> = this._createFormGroupPriorityList(this._priorityMapping, formGroup);
      const nonEmptyLevels = formGroupPriorityList.filter(item => item.value !== '');
      const sortedFormGroupPriorityList = this._sortList(nonEmptyLevels, 'desc', 'priority');
      const highestPriorityLevelValue = sortedFormGroupPriorityList[0];
      if (highestPriorityLevelValue) {
        res.push(highestPriorityLevelValue.value);
      }
    });
    return res;
  }
  private _createFormGroupPriorityList(
    priorityMapping: {[level: string]: number},
    formGroup: {[level: string]: string},
  ): Array<{
    priority: number;
    value: string;
  }> {
    const res: Array<{priority: number; value: string}> = [];
    for (const formGroupKey in formGroup) {
      if (formGroupKey in formGroup) {
        res.push({
          priority: priorityMapping[formGroupKey],
          value: formGroup[formGroupKey],
        });
      }
    };
    return res;
  }
  private _sortList(
    list: Array<any>,
    direction: 'asc' | 'desc',
    byKey: string,
  ): Array<any> {
    return list.sort((a: any, b: any) => {
      if (direction === 'asc') {
        return a[byKey] < b[byKey] ? -1 : 1;
      } else {
        return a[byKey] < b[byKey] ? 1 : -1;
      }
    });
  }
  private _emitBundleAttributesMetaData(): void {
    this.emitBundleAttributesCategoryForm.emit(this._bundleAttributesCategoriesForm);
  }
}
