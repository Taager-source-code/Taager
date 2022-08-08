import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserModel } from 'src/app/core/domain/user.model';
import { ChangeWalletPasswordUseCase } from 'src/app/core/usecases/change-wallet-password.usecase';
import { AuthService } from '../../auth/services/auth.service';
import { profileComponentsAssetsPathToken } from '../shared/config/profile.component.assets.path.config';
import nativeFormControlValuesMustMatchValidator from '../shared/validators/native-form-formcontrol-values-must-match.validators';

@Component({
    selector: 'app-change-wallet-password',
    styleUrls: [
        'change-wallet-password.component.scss'
    ],
    templateUrl: 'change-wallet-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeWalletPasswordComponent implements OnInit, OnDestroy {
    @Input() user: UserModel;
    public changeWalletPasswordForm: FormGroup;
    public changeWalletPasswordFormIsSubmitted = false;
    private minLengthErrorMessage = 'ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø± ÙŠØ¬Ø¨ Ø£Ù„Ø§ ØªÙ‚Ù„ Ø¹Ù† Ù© Ø­Ø±ÙˆÙ';
    private onDestroy$: Subject<boolean> = new Subject<boolean>();
    private changePasswordSuccess = 'ØªÙ… ØªØ¹Ø¯ÙŠÙ„  ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø±';
    private changePassword404Error = 'ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø± Ø®Ø§Ø·Ø¦Ø©';
    private changePasswordGeneralError = 'ÙŠÙˆØ¬Ø¯ Ù…Ø´ÙƒÙ„Ø© ÙÙŠ Ø§Ù„Ø³ÙŠØ±ÙØ±ØŒ Ù…Ù† ÙØ¶Ù„Ùƒ Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰';

    constructor(
        @Inject(profileComponentsAssetsPathToken) public assetsPath: string,
        private toastrService: ToastrService,
        private changeWalletPasswordUseCase: ChangeWalletPasswordUseCase
    ) {}

    ngOnInit(): void {
        this.instantiateChangeWalletPasswordForm();
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    public getErrorMappingForFormFields(field: string): any {
        const errors = {
            currentWalletPassword: {
                required: 'ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø­Ø§Ù„ÙŠØ© Ù…Ø·Ù„ÙˆØ¨Ø©'
            },
            newWalletPassword: {
                required: 'ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø© Ù…Ø·Ù„ÙˆØ¨Ø©',
                fieldsThatMustMatchDoMatchError: 'ÙŠØ¬Ø¨ Ø£Ù† ØªØªØ·Ø§Ø¨Ù‚ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø© Ùˆ ØªØ£ÙƒÙŠØ¯ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±',
                minlength: this.minLengthErrorMessage
            },
            confirmWalletPassword: {
                required: 'ØªØ£ÙƒÙŠØ¯ ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø© Ù…Ø·Ù„ÙˆØ¨Ø©',
                fieldsThatMustMatchDoMatchError: ' ÙŠØ¬Ø¨ Ø£Ù† ØªØªØ·Ø§Ø¨Ù‚ ØªØ£ÙƒÙŠØ¯ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ùˆ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©',
                minlength: this.minLengthErrorMessage
            }
        };
        return errors[field];
    }

    public onSubmitChangeWalletPasswordForm(): void {
        this.changeWalletPasswordFormIsSubmitted = true;
        if (this.changeWalletPasswordForm.valid) {
            const useCaseParams = {
                currentWalletPassword: this.changeWalletPasswordForm.get('currentWalletPassword').value,
                newWalletPassword: this.changeWalletPasswordForm.get('newWalletPassword').value,
                confirmWalletPassword: this.changeWalletPasswordForm.get('confirmWalletPassword').value,
            };
            this.changeWalletPasswordUseCase.execute(useCaseParams).pipe(
                takeUntil(this.onDestroy$)
            ).subscribe(
                _ => this.showNotificationMessage('success', this.changePasswordSuccess),
                err => {
                    if (err.status === 403) {
                        this.showNotificationMessage('error', this.changePassword404Error, 25000);
                    } else {
                        this.showNotificationMessage('error', this.changePasswordGeneralError);
                    }
                }
            );
        }
    }

    showNotificationMessage(
        status: 'success' | 'error',
        message: string,
        timeOut: number = 0
    ): void {
        switch(status) {
            case 'success':
                this.toastrService.success(message, '', { timeOut });
                break;
            case 'error':
                this.toastrService.error(message, '', { timeOut });
        }
    }

    private instantiateChangeWalletPasswordForm(): void {
        this.changeWalletPasswordForm = new FormGroup({
            currentWalletPassword: new FormControl('', [Validators.required]),
            newWalletPassword: new FormControl('', [
              Validators.required,
              Validators.minLength(9),
            ]),
            confirmWalletPassword: new FormControl('', [Validators.required]),
        }, [nativeFormControlValuesMustMatchValidator(['newWalletPassword', 'confirmWalletPassword'])]);
    }
}


