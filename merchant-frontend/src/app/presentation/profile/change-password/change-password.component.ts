import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserModel } from 'src/app/core/domain/user.model';
import nativeFormControlValuesMustMatchValidator from '../shared/validators/native-form-formcontrol-values-must-match.validators';
import { ChangePasswordUseCase } from 'src/app/core/usecases/change-password.usecase';
import { profileComponentsAssetsPathToken } from '../shared/config/profile.component.assets.path.config';

@Component({
    selector: 'app-change-password',
    styleUrls: [
        'change-password.component.scss'
    ],
    templateUrl: 'change-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
    @Input() user: UserModel;

    public changePasswordForm: FormGroup;
    public changePasswordFormIsSubmitted: boolean;
    public onDestroy$: Subject<boolean> = new Subject<boolean>();
    private changePasswordSuccess = 'ØªÙ… ØªØ¹Ø¯ÙŠÙ„  ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø±';
    private changePassword403Forbidden = 'ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø± Ø®Ø§Ø·Ø¦Ø©';
    private changePasswordGeneralError = 'ÙŠÙˆØ¬Ø¯ Ù…Ø´ÙƒÙ„Ø© ÙÙŠ Ø§Ù„Ø³ÙŠØ±ÙØ±ØŒ Ù…Ù† ÙØ¶Ù„Ùƒ Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰ÙŠ';
    private minLengthErrorMessage = 'ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø± ÙŠØ¬Ø¨ Ø£Ù„Ø§ ØªÙ‚Ù„ Ø¹Ù† Ù© Ø­Ø±ÙˆÙ';

    constructor(
        private toastrService: ToastrService,
        private changePasswordUseCase: ChangePasswordUseCase,
        @Inject(profileComponentsAssetsPathToken) public assetsPath: string,
    ) {}

    ngOnInit(): void {
        this.initializeChangePasswordForm();
    }

    initializeChangePasswordForm(): void {
        this.changePasswordForm = new FormGroup({
            currentPassword: new FormControl('', [Validators.required]),
            newPassword: new FormControl('', [
                Validators.required,
                Validators.minLength(9),
            ]),
            confirmPassword: new FormControl('', [
                Validators.required,
                Validators.minLength(9)
            ]),
        }, [nativeFormControlValuesMustMatchValidator(['newPassword', 'confirmPassword'])]);
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    public onChangeNewPasswordFormSubmit(): void {
        this.changePasswordFormIsSubmitted = true;
    }

    public returnFormFieldErrorsAsAnArray(
        fieldErrorsObject: {[error: string]: boolean},
        crossFormErrors: {[error: string]: boolean} = {}
    ): Array<string> {
        const errors: Array<string> = [];
        const combinedErrors = { ...crossFormErrors, ...fieldErrorsObject };
        for (const key in combinedErrors) {
            if(combinedErrors[key]) {
                errors.push(key);
            }
        }
        return errors;
    }

    public getErrorMappingForFormFields(field: string): any {
        const errors = {
            currentPassword: {
                required: 'ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø­Ø§Ù„ÙŠØ© Ù…Ø·Ù„ÙˆØ¨Ø©'
            },
            newPassword: {
                required: 'ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø© Ù…Ø·Ù„ÙˆØ¨Ø©',
                fieldsThatMustMatchDoMatchError: 'ÙŠØ¬Ø¨ Ø£Ù† ØªØªØ·Ø§Ø¨Ù‚ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø© Ùˆ ØªØ£ÙƒÙŠØ¯ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±',
                minlength: this.minLengthErrorMessage
            },
            confirmPassword: {
                required: 'ØªØ£ÙƒÙŠØ¯ ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø© Ù…Ø·Ù„ÙˆØ¨Ø©',
                fieldsThatMustMatchDoMatchError: ' ÙŠØ¬Ø¨ Ø£Ù† ØªØªØ·Ø§Ø¨Ù‚ ØªØ£ÙƒÙŠØ¯ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ùˆ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©',
                minlength: this.minLengthErrorMessage
            }
        };
        return errors[field];
    }

    onSubmitChangePasswordForm(): void {
        this.changePasswordFormIsSubmitted = true;
        if (this.changePasswordForm.invalid) {
            return;
        }
        this.changePasswordUseCase
            .execute(this.changePasswordForm.value)
            .pipe(
                takeUntil(this.onDestroy$)
            ).subscribe(
                _ => {
                    this.showNotificationMessage('success', this.changePasswordSuccess);
                },
                err => {
                    if (err.status === 403) {
                        this.showNotificationMessage('error', this.changePassword403Forbidden);
                    } else {
                        this.showNotificationMessage('error', this.changePasswordGeneralError);
                    }
                }
            );
    }

    showNotificationMessage(
        status: 'success' | 'error',
        message: string
    ): void {
        switch(status) {
            case 'success':
                this.toastrService.success(message);
                break;
            case 'error':
                this.toastrService.error(message);
        }
    }
}


