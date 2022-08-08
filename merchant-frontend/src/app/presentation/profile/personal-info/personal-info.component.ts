import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { UserModel } from 'src/app/core/domain/user.model';
import { GetUserUseCase } from 'src/app/core/usecases/get-user.usecase';
import { SetUserUseCase } from 'src/app/core/usecases/set-user-usecase';
import { UpdateProfilePictureUseCase } from 'src/app/core/usecases/update-profile-picture-usecase';
import { UpdateProfileUseCase } from 'src/app/core/usecases/update-profile-usercase';
import { profileComponentsAssetsPathToken } from '../shared/config/profile.component.assets.path.config';

@Component({
    templateUrl: 'personal-info.component.html',
    selector: 'app-personal-info',
    styleUrls: [
        'personal-info.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
    @Input() user: UserModel;
    public headerText = 'Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø´Ø®ØµÙŠØ©';
    public subHeaderText = 'ÙŠÙ…ÙƒÙ†Ùƒ ØªØ¹Ø¯ÙŠÙ„ Ù…Ø¹Ù„ÙˆÙ…Ø§ØªÙƒ Ø§Ù„Ø´Ø®ØµÙŠØ© Ùˆ Ø¨Ø¹Ø¶ Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª';
    public personalInformationForm: FormGroup;
    private onDestroy$: Subject<boolean> = new Subject<boolean>();
    private profileFields: Array<string>;
    private successSettingUser = ' ØªÙ… ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª';
    private errorSettingUser = 'An error occured!';
    private uploadInProgress = 'Upload in Progress.';
    private uploadComplete = 'Upload Complete.';
    private errorCompletingUpload = 'Error completing the upload! Please try again later.';

    constructor(
        private toast: ToastrService,
        private changeDetectorRef: ChangeDetectorRef,
        private getUserUseCase: GetUserUseCase,
        private updateProfilePictureUseCase: UpdateProfilePictureUseCase,
        private setUserUseCase: SetUserUseCase,
        private updateProfileUseCase: UpdateProfileUseCase,
        @Inject(profileComponentsAssetsPathToken) public assetsPath: string,
    ) { }

    ngOnInit(): void {
        this.instantiatePersonalInformationForm();
        this.patchPersonalInformationForm();
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    instantiatePersonalInformationForm(): void {
        this.personalInformationForm = new FormGroup({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            phoneNum: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.email, Validators.required])
        });
        this.profileFields = ['firstName', 'lastName', 'phoneNum', 'email'];
    }

    patchPersonalInformationForm(): void {
        if (this.user) {
            this.profileFields.forEach(field => this.personalInformationForm.get(field)?.patchValue(this.user[field]));
        }
    }

    public onFileFieldChange($event: any): void {
        const file = $event.srcElement.files[0];
        if (file) {
            this.toast.info(this.uploadInProgress);
            this.updateProfilePictureUseCase
                .execute({ picture: file, pictureName: this.user.username })
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((resp: any) => {
                    this.user.profilePicture = resp.msg;
                    this.changeDetectorRef.detectChanges();
                    this.toast.success(this.uploadComplete);
                    this.setUser(this.user);
                }, _ => this.toast.error(this.errorCompletingUpload));
        }
    }

    public onEditPersonalInformationConfirmation(): void {
        if (this.personalInformationForm.valid && this.personalInformationForm.dirty) {
            this.updateProfileUseCase.execute(this.personalInformationForm.value).pipe(
                takeUntil(this.onDestroy$),
                map(response => response.data)
            ).subscribe(updatedUser => {
                this.getUserUseCase.execute().pipe(
                    takeUntil(this.onDestroy$),
                    map(retrievedUser => this.returnDeepCopy(retrievedUser))
                ).subscribe(retrievedUser => this.setUser({ ...retrievedUser, ...updatedUser }));
            }, error => this.toast.error(error.error.msg));
        }
    }

    /**
     *
     * @param userData
     *
     * shared local method for setting the user.
     */
    private setUser(userData: UserModel): void {
        this.setUserUseCase.execute(userData).pipe(
            takeUntil(this.onDestroy$)
        ).subscribe(
            _ => this.toast.success(this.successSettingUser),
            _ => this.toast.error(this.errorSettingUser)
        );
    }

    private returnDeepCopy(referenceObject: any): any {
        return JSON.parse(JSON.stringify(referenceObject));
    }
}


