import { Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BundleUISectionsAttributesDetails } from '../../helpers/product-variant-group.deserializer';
@Component({
  selector: 'ngx-bundle-attribute-details',
  templateUrl: './bundle-attribute-details.component.html',
  styleUrls: ['./bundle-attribute-details.component.scss'],
})
export class BundleAttributeDetailsComponent implements OnInit, OnDestroy {
  @Input() onDialogClose$: Subject<boolean> = new Subject<boolean>();
  @Input() initialData: BundleUISectionsAttributesDetails;
  @Input() showFormErrors$: Subject<boolean> = new Subject<boolean>();
  @Output() emitBundleAttributesDetailsForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  public videoLinks: Array<{url: string}> = [{ url: '' }];
  public bundleAttributesDetailsFormGroup = new FormGroup({
    bundleSpecification: new FormControl('', [Validators.required]),
    bundleDescription: new FormControl('', [Validators.required]),
    bundleVideoLinks: new FormControl([]),
  });
  private _onDestroy$: Subject<boolean>;
  constructor(
  ) {
    this._onDestroy$ = new Subject();
  }
  ngOnInit(): void {
    this._listenForFormChanges();
    this._listenForDialogClose();
    this._optionallyPatchForm();
  }
  ngOnDestroy(): void {
    this.bundleAttributesDetailsFormGroup.reset(undefined, {emitEvent: false});
    this.videoLinks = [];
    this._onDestroy$.next(true);
    this._onDestroy$.complete();
  }
  public addLink(ev) {
    ev.preventDefault();
    this.videoLinks.push({ url: '' });
  }
  public removeLink(index) {
    this.videoLinks = this.videoLinks.filter((element, i) => i !== index);
    this.onVideoLinksChange();
  }
  public onVideoLinkChange(ev, index){
    this.videoLinks[index].url = ev.target.value;
    this.onVideoLinksChange();
  }
  public onVideoLinksChange() {
    this.bundleAttributesDetailsFormGroup.patchValue({
      bundleVideoLinks: this.videoLinks.map(({ url }) => url) || [],
    });
  }
  public onBundleSpecificationsChange() {
    let specifications = this.bundleAttributesDetailsFormGroup.get('bundleSpecification').value;
    specifications = specifications
      .replace(/\r/g, '')
      .split(/\n/)
      .map((line) => {
        if (line.charAt(0) !== '•') {
          line = '•' + line;
        }
        if (line.charAt(1) !== ' ') {
          line = '• ' + line.substring(1);
        }
        return line;
      })
      .filter((line, idx, arr) => {
        if (idx !== arr.length - 1 && line.length === 2) {
          return false;
        }
        return true;
      })
      .join('\r\n');
    if (specifications.length === 2) {
      specifications = '';
    }
    this.bundleAttributesDetailsFormGroup.get('bundleSpecification').setValue(specifications);
  }
  private _listenForDialogClose(): void {
    this.onDialogClose$.subscribe(_ => this.ngOnDestroy());
  }
  private _listenForFormChanges() {
    this.bundleAttributesDetailsFormGroup.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(_ => this.emitBundleAttributesDetailsForm.emit(this.bundleAttributesDetailsFormGroup));
  }
  private _optionallyPatchForm(): void {
    if (this.initialData) {
      this.videoLinks = this.initialData.bundleVideoLinks.map(url => ({ url }));
      this.bundleAttributesDetailsFormGroup.patchValue({
        bundleSpecification: this.initialData.bundleSpecification,
        bundleDescription: this.initialData.bundleDescription,
        bundleVideoLinks: this.videoLinks.map(({ url }) => url),
      });
    }
  }
}
