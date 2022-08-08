import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
@Component({
  selector: 'ngx-bundle-attribute-images',
  templateUrl: './bundle-attribute-images.component.html',
  styleUrls: ['./bundle-attribute-images.component.scss'],
})
export class BundleAttributeImagesComponent implements OnInit, OnDestroy {
  @Input() initialData: Array<string>;
  @Input() onDialogClose$: Subject<boolean> = new Subject<boolean>();
  @Output() emitBundleAttributesImagesForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  public bundleAttributesImagesFromGroup = new FormGroup({
    bundleImages: new FormControl([], [Validators.required]),
  });
  constructor() { }
  ngOnInit(): void {
    this.listenForFormChanges();
    this._listenForDialogClose();
    this._optionallyPatchForm();
  }
  ngOnDestroy(): void {
    this.bundleAttributesImagesFromGroup.reset({bundleImages: []}, {emitEvent: false});
  }
  onUpdateImages(images: string[]): void {
    this.bundleAttributesImagesFromGroup.patchValue({
      bundleImages: images,
    });
  }
  getBundleImages() {
    return this.bundleAttributesImagesFromGroup.get('bundleImages').value;
  }
  listenForFormChanges() {
    this.bundleAttributesImagesFromGroup.valueChanges.pipe(
    ).subscribe(_ => this.emitBundleAttributesImagesForm.emit(this.bundleAttributesImagesFromGroup));
  }
  private _listenForDialogClose(): void {
    this.onDialogClose$.subscribe(_ => this.ngOnDestroy());
  }
  private _optionallyPatchForm(): void {
    if (this.initialData) {
      this.bundleAttributesImagesFromGroup.patchValue({
        bundleImages: this.initialData,
      });
    }
  }
}
