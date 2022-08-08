import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '@core/domain/user.model';
import { GetUserByTaagerIdUseCase } from '@core/usecases/user/get-user-by-taager-id.usecase';
import { GetUserUseCase } from '@core/usecases/user/get-user.usecase';
import { UploadImageUseCase } from '@core/usecases/utilities/upload-image.usecase';
import { AVAILABILITY_STATUSES } from '@data/constants';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { debounceTime, finalize, map, takeUntil } from 'rxjs/operators';
import { BundleUISectionsInfo } from '../helpers/product-variant-group.deserializer';
@Component({
  selector: 'ngx-bundle-info',
  templateUrl: './bundle-info.component.html',
  styleUrls: ['./bundle-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BundleInfoComponent implements OnInit {
  @Input() initialData: BundleUISectionsInfo;
  @Input() onDialogClose$: Subject<boolean> = new Subject<boolean>();
  @Input() showFormErrors$: Subject<boolean> = new Subject<boolean>();
  @Input() selectedCountryPrice;
  @Output() bundleInfoFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  public bundleInfoFormGroup: FormGroup;
  public availabilityStatuses = AVAILABILITY_STATUSES;
  public mainImageUrl: string | ArrayBuffer;
  public mainImageName: string;
  public isUploadingImage = false;
  public visibleToSellersValue = '';
  /**
   * TODO: for now, since what we are using, syncfusion sidebar does not have
   * the on destroy event, we cannot use onDestroy$ on the ngOnDestroy block.
   *
   * This comment is being left here intentionally, so that we can be able to
   * refer to it in future.
   *
   * Also, the other reason is that, when we supposedly 'destroy' this component's
   * parent component BundleManagerComponent, we are not actually destroying it from
   * DOM tree, but just showing or hidding it, so it is not re-initialized
   * so to speak, and hence the reason why we cannot rely on it to handle the
   * onDestroy hook.
   */
  // private _onDestroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private _uploadImageUseCase: UploadImageUseCase,
    private _changeDetectorRef: ChangeDetectorRef,
    private _getUserByTaagerIdUseCase: GetUserByTaagerIdUseCase,
    private _getUserUseCase: GetUserUseCase,
  ) { }
  public availabilityFilterFormatter: (val: string) => any = (
    (val: string) => val.split('_').join(' ').replace('qty', 'quantity'));
  ngOnInit(): void {
    this._initializeBundleInfoFormGroup();
    this._listenForDialogClose();
  }
  public handleImageUpload($event: any): void {
    this.isUploadingImage = true;
    const defaultImageFile = $event.srcElement.files[0];
    if(defaultImageFile) {
      const defaultImageFormData = new FormData();
      defaultImageFormData.append('image', defaultImageFile);
      this.mainImageName = defaultImageFile.name;
      this._doUploadImage(defaultImageFormData);
    }
  }
  public onVisibleToMerchantsBlur($event: any): void {
    const visibleToSellersIdsList: {[sellerId: string]: Observable<UserModel>} = {};
    if ($event.target.value === '') {
      this._commonPatchFormField('visibleToSellers', '', true);
      return;
    }
    ((($event.target.value.split(',') as Array<string>).filter(
      userTaagerId => userTaagerId !== '') || []) as Array<string>).forEach(
        sellerId => visibleToSellersIdsList[sellerId]=this._getUserByTaagerIdUseCase.execute(sellerId),
    );
    forkJoin(visibleToSellersIdsList).pipe().subscribe((users: {[props: string]: any}) => {
      const visibleToSellers = Object.keys(users).map(userIdKey => users[userIdKey]._id).join(',');
      this.visibleToSellersValue = $event.target.value;
      this._commonPatchFormField('visibleToSellers', visibleToSellers, true);
    });
  }
  private _doUploadImage(payload: FormData): void {
    this._uploadImageUseCase
        .execute(payload)
        .pipe(
          finalize(() => {
            this.isUploadingImage = false;
            this._commonChangeDetector();
          }),
        )
        .subscribe(data => {
          if (FileReader) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
              this.mainImageUrl = fileReader.result;
            };
            fileReader.readAsDataURL(payload.get('image') as Blob);
          }
          this._commonPatchFormField('defaultImage', data.url, true);
        });
  }
  private _commonChangeDetector(): void {
    this._changeDetectorRef.detectChanges();
  }
  private _listenForDialogClose(): void {
    this.onDialogClose$
        .subscribe(_ => {
          this.bundleInfoFormGroup
              .reset(undefined, {emitEvent: false});
        });
  }
  private _initializeBundleInfoFormGroup(): void {
    this.bundleInfoFormGroup = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      productId: new FormControl('', [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      profit: new FormControl(null, [Validators.required]),
      isExpired: new FormControl(false, [Validators.required]),
      visibleToSellers: new FormControl(''),
      productAvailability: new FormControl('available', [Validators.required]),
      defaultImage: new FormControl(null, [Validators.required]),
    });
    this._listenFormBundleInfoFormGroupChange();
    this._optionalyPatchBundleInfoFormGroupWithInitialData();
  }
  private _optionalyPatchBundleInfoFormGroupWithInitialData(): void {
    const nonFormDrivenFields = [
      'defaultImage',
      'visibleToSellers',
    ];
    if (this.initialData) {
      for (const attribute in this.initialData) {
        if (attribute in this.initialData) {
          if (nonFormDrivenFields.indexOf(attribute) === -1) {
            this._commonPatchFormField(attribute, this.initialData[attribute], true);
          } else {
            if (attribute === 'defaultImage') {
              this.mainImageUrl = this.initialData[attribute];
              this._commonPatchFormField(attribute, this.initialData[attribute], true);
            }
            if (attribute === 'visibleToSellers') {
              const visibleToSellersUUIDList = this.initialData[attribute].split(',');
              const visibleToSellersGetUserByTaagerUUID = {};
              visibleToSellersUUIDList.forEach(merchantUUID => {
                visibleToSellersGetUserByTaagerUUID[merchantUUID] = this._getUserUseCase.execute(merchantUUID);
              });
              /**
               * TODO
               *
               * Push the backend to create endpoint for bulk retrieving of users
               */
              forkJoin(visibleToSellersGetUserByTaagerUUID)
                .pipe(
                  takeUntil(this.onDialogClose$),
                  map((merchantsHashMap: {[merchantId: string]: UserModel}) => Object.keys(merchantsHashMap).map(
                    merchantId => merchantsHashMap[merchantId].TagerID,
                  )),
                  map(merchantsTaagerIDs => merchantsTaagerIDs.join(',')),
                ).subscribe(merchantsTaagerIDString => {
                  this._commonPatchFormField('visibleToSellers', this.initialData[attribute], true);
                  this.visibleToSellersValue = merchantsTaagerIDString;
                });
            }
          }
        }
      }
    }
  }
  private _commonPatchFormField(
    control: string,
    value: any,
    emitEvent: boolean,
  ) {
    this.bundleInfoFormGroup.patchValue({
      [control]: value,
    }, { emitEvent });
  }
  private _listenFormBundleInfoFormGroupChange(): void {
    this.bundleInfoFormGroup
        .valueChanges
        .pipe(
          debounceTime(500),
        ).subscribe(_ => this.bundleInfoFormGroupChange.emit(this.bundleInfoFormGroup));
  }
}
