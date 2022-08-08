/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, finalize, pairwise } from 'rxjs/operators';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { trace } from '@angular/fire/compat/performance';

import { AuthService } from 'src/app/presentation/auth/services/auth.service';
import { ResponsiveService } from 'src/app/presentation/shared/services/responsive.service';
import { LocalStorageService } from 'src/app/presentation/shared/services/local-storage.service';
import { HOME_URL, MULTITENANCY_CONSTS } from 'src/app/presentation/shared/constants';
import { MultitenancyService } from 'src/app/presentation/shared/services/multitenancy.service';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';
import { LoginUserUseCase } from 'src/app/core/usecases/login-user.usecase';

declare let gtag;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public queryString: any;
  public isMobile: boolean;
  public submitted = false;
  public errorMessage = '';
  public isLoading = false;
  public referredByUserId = '';
  public registerForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    phoneNum: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
    ]),
    confirmPassword: new FormControl('',
      [Validators.required]
    ),
    email: new FormControl('', [Validators.email]),
    referredBy: new FormControl('', [this.validateReferralCode.bind(this)]),
  }, { validators: this.passwordMatchCheck.bind(this) });

  constructor(
    private mixpanelService: MixpanelService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private loginUserUseCase: LoginUserUseCase,
    private responsiveService: ResponsiveService,
    private socialAuthService: SocialAuthService,
    private multitenancyService: MultitenancyService,
  ) { }

  ngOnInit(): void {
    this.getIsMobile();

    this.route.params.subscribe((params) => {
      if (params.referralCode) {
        this.authService
          .getUserByReferralCode(params.referralCode)
          .subscribe((res: any) => {
            if (res) {
              this.registerForm.get('referredBy').setValue(params.referralCode);
              // eslint-disable-next-line no-underscore-dangle
              this.referredByUserId = res.data._id;
            } else {
              this.router.navigate(['register']);
            }
          });
      }
    });

    this.route.queryParams
      .subscribe(params => {
        this.queryString = params;
      }
      );

    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        const previousUrl = events[0].urlAfterRedirects;
        if (previousUrl === HOME_URL) {
          this.mixpanelService.track('sign_up_page_load', { $is_from_home_page: true });
        } else {
          this.mixpanelService.track('sign_up_page_load', { $is_from_home_page: false });
        }
      });
  }

  passwordMatchCheck(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmPassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  getIsMobile(): void {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  signInWithGoogle(): void {
    this.isLoading = true;
    let shouldTrackSignupEvent = false;
    this.socialAuthService.initState.subscribe(
      () => { },
      (err) => {
        this.isLoading = false;
        this.errorMessage = 'Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø§ØªØµØ§Ù„ØŒ Ù…Ù† ÙØ¶Ù„Ùƒ Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰';
      }, () => {
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(err => {
          this.isLoading = false;
          this.errorMessage = 'Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø§ØªØµØ§Ù„ØŒ Ù…Ù† ÙØ¶Ù„Ùƒ Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰';
        });
      });
    this.socialAuthService.authState.subscribe((user) => {
      this.authService.socialAuthSignIn(user).subscribe(
        (res: any) => {
          const { userIsNew, user: userResponse, jwt } = res;
          gtag('event', 'sign_up', {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            event_label: 'method: Google, email:' + userResponse.email
          });
          const storedUser = {
            ...userResponse,
            jwt
          };
          this.localStorageService.setUser(storedUser);
          if (this.multitenancyService.isMultitenancyEnabled()) {
            const savedCountry = location.href.split('/')[3].length === 2 ?
              location.href.split('/')[3]
              : MULTITENANCY_CONSTS.EGYPT_ISOCODE_2;
            this.multitenancyService.setCurrentCountry(savedCountry);
          }
          shouldTrackSignupEvent = userIsNew;
          this.router.navigate(['products'], { queryParams: this.queryString });
        },
        (err) => {
          this.errorMessage = 'ÙŠÙˆØ¬Ø¯ Ù…Ø´ÙƒÙ„Ø© ÙÙŠ Ø§Ù„Ø³ÙŠØ±ÙØ±ØŒ Ù…Ù† ÙØ¶Ù„Ùƒ Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰';
          this.isLoading = false;
        },
        () => {
          if (shouldTrackSignupEvent) {
            this.setUpMixpanel('sign_up', 'google');
          }
        });
    });
  }

  get fullName(): AbstractControl {
    return this.registerForm.get('fullName');
  }

  get phoneNum(): AbstractControl {
    return this.registerForm.get('phoneNum');
  }

  get password(): AbstractControl {
    return this.registerForm.get('password');
  }

  get email(): AbstractControl {
    return this.registerForm.get('email');
  }

  get referredBy(): AbstractControl {
    return this.registerForm.get('referredBy');
  }
  public async getUserId(val) {
    const flag = '';

    return flag;
  }

  public validateReferralCode(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (control.value !== '') {
      this.authService
        .getUserByReferralCode(control.value)
        .subscribe((res: any) => {
          // eslint-disable-next-line no-underscore-dangle
          this.referredByUserId = res.data._id;
          control.setErrors(null);
        });
      return { validReferralCode: false };
    } else {
      return null;
    }
  }

  public registerUser(): void {
    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe(
      (res: any) => {
        this.isLoading = false;
        gtag('event', 'sign_up', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          event_label: 'method: website, phoneNum:' + this.phoneNum.value
        });
        this.loginUserUseCase.execute({
          usernameOrPhoneNumber: this.phoneNum.value,
          password: this.password.value,
        })
          .pipe(
            // measure the amount of time between the Observable being subscribed to and first emission (or completion)
            trace('register-user'),
            finalize(() => {
              this.isLoading = false;
            })
          )
          .subscribe(
            (user: any) => {
              this.localStorageService.setUser(user);
              if (this.multitenancyService.isMultitenancyEnabled()) {
                const savedCountry = location.href.split('/')[3].length === 2 ?
                  location.href.split('/')[3] : MULTITENANCY_CONSTS.EGYPT_ISOCODE_2;
                this.multitenancyService.setCurrentCountry(savedCountry);
              }
              this.router.navigate(['products'], { queryParams: this.queryString });
              this.setUpMixpanel('sign_up', 'normal');
            },
            (err) => {
              this.errorMessage =
                'ÙŠÙˆØ¬Ø¯ Ù…Ø´ÙƒÙ„Ø© ÙÙŠ Ø§Ù„Ø³ÙŠØ±ÙØ±ØŒ Ù…Ù† ÙØ¶Ù„Ùƒ Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰';
            }
          );
      },
      (err) => {
        this.toastr.info('invalid save');
        this.isLoading = false;
        if (err.status === 409) {
          this.errorMessage = 'Ø±Ù‚Ù… Ø§Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„ Ø£Ùˆ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø§ÙƒØªØ±ÙˆÙ†ÙŠ Ù…Ø³Ø¬Ù„ Ù„Ø¯ÙŠÙ†Ø§';
        } else if (err.status === 204) {
          this.errorMessage = 'invalid referral code';
        } else {
          this.errorMessage = 'ÙŠÙˆØ¬Ø¯ Ù…Ø´ÙƒÙ„Ø© ÙÙŠ Ø§Ù„Ø³ÙŠØ±ÙØ±ØŒ Ù…Ù† ÙØ¶Ù„Ùƒ Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰';
        }
      }
    );
  }

  public navigateToSignIn() {
    this.router.navigate(['login'], { queryParams: this.queryString, queryParamsHandling: 'merge' });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (this.registerForm.invalid) {
      this.toastr.info('invalid');
      return;
    } else {
      this.registerForm.get('referredBy').setValue(this.referredByUserId);
      this.registerUser();
    }
  }

  private setUpMixpanel(eventName, signupUsing): void {
    const storedUser = this.localStorageService.getUser();
    this.mixpanelService.peoples(storedUser.TagerID, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      taager_id: storedUser.TagerID,
      $phone: storedUser.phoneNum,
      $email: storedUser.email,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      $first_name: storedUser.firstName,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      $last_name: storedUser.lastName,
      $name: storedUser.firstName + ' ' + storedUser.lastName,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Count Orders': 0,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Delivered Orders': 0,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Loyalty Program': storedUser ? storedUser.loyaltyProgram?.loyaltyProgram : 'BLUE',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      signup_using: signupUsing,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      join_date: storedUser.createdAt,
    });
    this.mixpanelService.track(eventName, {
      email: storedUser.email,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      join_date: storedUser.createdAt,
      phone: storedUser.phoneNum,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      signup_using: signupUsing,
    });
  }
}


