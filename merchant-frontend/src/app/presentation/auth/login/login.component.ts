import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators, } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { trace } from '@angular/fire/compat/performance';


import { AuthService } from 'src/app/presentation/auth/services/auth.service';
import { ResponsiveService } from 'src/app/presentation/shared/services/responsive.service';

import { LocalStorageService } from 'src/app/presentation/shared/services/local-storage.service';
import { MULTITENANCY_CONSTS, REDIRECT_URL } from 'src/app/presentation/shared/constants';
import { MultitenancyService } from 'src/app/presentation/shared/services/multitenancy.service';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';
import { ProfileService } from 'src/app/presentation/shared/services/profile.service';
import { MessagingService } from 'src/app/presentation/shared/services/messaging.service';
import { LoginUserUseCase } from 'src/app/core/usecases/login-user.usecase';
import { LoginUserWithGoogleUseCase } from 'src/app/core/usecases/login-user-with-google.usecase';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public queryString: any;
  public tager: any;
  public wallet: any;
  public submitted = false;
  public countorders: number;
  public deliveredorders: number;
  public isLoggingIn: boolean;
  public isMobile: boolean;
  public errorMessage = '';
  public loginForm: FormGroup = new FormGroup({
    mobile: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private mixpanelService: MixpanelService,
    private routes: ActivatedRoute,
    private profileService: ProfileService,
    private auth: AuthService,
    private route: Router,
    private responsiveService: ResponsiveService,
    private toast: ToastrService,
    private localStorageService: LocalStorageService,
    private multitenancyService: MultitenancyService,
    private messagingService: MessagingService,
    private loginUserUseCase: LoginUserUseCase,
    private loginUserWithGoogleUseCase: LoginUserWithGoogleUseCase,
  ) {
  }

  get mobile(): AbstractControl {
    return this.loginForm.get('mobile');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  ngOnInit(): void {
    this.getIsMobile();
    this.routes.queryParams.subscribe((params) => {
      this.queryString = params;
    });
  }

  signInWithGoogle(): void {
    this.isLoggingIn = true;
    this.loginUserWithGoogleUseCase.execute()
      .pipe(
        finalize(() => this.isLoggingIn = false)
      )
      .subscribe(
        (user) => {
          if (this.multitenancyService.isMultitenancyEnabled()) {
            const savedCountry = location.href.split('/')[3].length === 2
              ? location.href.split('/')[3]
              : MULTITENANCY_CONSTS.EGYPT_ISOCODE_2;
            this.multitenancyService.setCurrentCountry(savedCountry);
          }
          this.messagingService.requestNotificationPermission();
          const redirectUrl = this.localStorageService.getStorage(REDIRECT_URL);
          if (redirectUrl) {
            this.route.navigateByUrl(redirectUrl);
            this.localStorageService.remove(REDIRECT_URL);
          } else {
            this.route.navigate(['products-v2'], {
              queryParams: this.queryString,
              queryParamsHandling: 'merge'
            });
          }
          this.setupMixpanel('Login_attempt', {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Status: 'Logged In',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            login_using: 'Google'
          });
        },
        (err) => {
          this.errorMessage = err.message;
          if (err.status === 403) {
            this.errorMessage = 'ØºÙŠØ± Ù…ØµØ±Ø­ Ù„Ùƒ Ø¨Ø§Ù„Ø¯Ø®ÙˆÙ„ Ù‡Ù†Ø§';
            this.mixpanelService.track('Login_attempt', {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              Status: 'Unauthorized',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              login_using: 'Google',
            });
          }
          this.toast.error(this.errorMessage);
        }
      );
  }

  getIsMobile(): void {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoggingIn = true;
    this.loginUserUseCase.execute({
      usernameOrPhoneNumber: this.loginForm.value.mobile,
      password: this.loginForm.value.password,
    }).pipe(
      // measure the amount of time between the Observable being subscribed to and first emission (or completion)
      trace('login-user'),
      finalize(() => {
        this.isLoggingIn = false;
      })
    ).subscribe((user) => {
      // move it login use case
      this.localStorageService.setUser(user);
      if (this.multitenancyService.isMultitenancyEnabled()) {
        const savedCountry = location.href.split('/')[3].length === 2
          ? location.href.split('/')[3]
          : MULTITENANCY_CONSTS.EGYPT_ISOCODE_2;
        this.multitenancyService.setCurrentCountry(savedCountry);
      }
      // should be use case
      this.messagingService.requestNotificationPermission();
      // get metadata with the user
      const redirectUrl = this.localStorageService.getStorage(REDIRECT_URL);
      // stay in presentation
      if (redirectUrl) {
        this.route.navigateByUrl(redirectUrl);
        this.localStorageService.remove(REDIRECT_URL);
      } else {
        this.route.navigate(['products-v2'], { queryParams: {}, queryParamsHandling: 'merge' });
      }
      // use event manager
      this.setupMixpanel('Login_attempt', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Status: 'Logged In',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        login_using: user.provider,
      });
    }, (error) => {
      if (error.status === 401 || error.status === 422) {
        this.mixpanelService.track('Login_attempt', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Status: 'Incorrect Password',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_using: 'normal',
        });
        this.errorMessage = 'Ø±Ù‚Ù… Ø§Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„ Ø£Ùˆ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± ØºÙŠØ± ØµØ­ÙŠØ­Ø©';
      } else if (error.status === 404) {
        this.errorMessage = 'Ø±Ù‚Ù… Ø§Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„ Ø£Ùˆ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± ØºÙŠØ± ØµØ­ÙŠØ­Ø©';
        this.mixpanelService.track('Login_attempt', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Status: 'No Account Found',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_using: 'normal',
        });
      } else if (error.status === 403) {
        this.errorMessage = 'ØºÙŠØ± Ù…ØµØ±Ø­ Ù„Ùƒ Ø¨Ø§Ù„Ø¯Ø®ÙˆÙ„ Ù‡Ù†Ø§';
        this.mixpanelService.track('Login_attempt', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Status: 'Unauthorized',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_using: 'normal',
        });
      } else {
        this.errorMessage = 'ÙŠÙˆØ¬Ø¯ Ù…Ø´ÙƒÙ„Ø© ÙÙŠ Ø§Ù„Ø³ÙŠØ±ÙØ±ØŒ Ù…Ù† ÙØ¶Ù„Ùƒ Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰';
        this.mixpanelService.track('Login_attempt', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Status: 'Server Error',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_using: 'normal',
        });
      }
    });
  }

  private setupMixpanel(eventName, eventPropertiesObject) {
    const user = this.localStorageService.getUser();
    this.profileService.getUserWallet().subscribe((res: any) => {
      const wallet = res.data;
      this.mixpanelService.peoples(`${user.TagerID}`, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        taager_id: user.TagerID || 'N/A',
        $phone: user.phoneNum || this.loginForm.value.mobile,
        $email: user.email || 'N/A',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        $first_name: user.firstName || 'N/A',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        $last_name: user.lastName || 'N/A',
        $name: user.firstName + ' ' + user.lastName || 'N/A',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Count Orders': wallet[0] ? wallet[0].countOrders : 'N/A',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Delivered Orders': wallet[0] ? wallet[0].deliveredOrders : 'N/A',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Loyalty Program': user.loyaltyProgram ? user.loyaltyProgram?.loyaltyProgram : 'N/A',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        join_date: user.createdAt || 'N/A',
      });
    }).add(() => {
      this.mixpanelService.track(eventName, eventPropertiesObject);
    });
  }
}


