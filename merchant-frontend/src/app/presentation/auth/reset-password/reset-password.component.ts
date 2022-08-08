import { Component, OnInit } from '@angular/core';
import {FormBuilder,AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ResponsiveService } from 'src/app/presentation/shared/services/responsive.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  private id: string;
  private resetToken: string;
  public submitted = false;
  public errorMessage = '';
  public successMessage = '';
  public loading = false;
  public isMobile: boolean;

  public resetForm: FormGroup;

  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private responsiveService: ResponsiveService) {
    this.resetForm = this.formBuilder.group({

      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(9)
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.required
      ]))

    },{
      validators: this.passwordMatchCheck.bind(this)
    });
  }

  passwordMatchCheck(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmPassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }


  ngOnInit(): void {
    this.getIsMobile();
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.resetToken = params.resetToken;
    });
  }

  getIsMobile(): void {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  get password(): AbstractControl {
    return this.resetForm.get('password');
  }

   get confirmPassword(): AbstractControl {
    return this.resetForm.get('confirmPassword');
  }

  public navigateToSignIn(){
    this.router.navigate(['login']);
  }

  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (this.resetForm.invalid) {
      return;
    } else {
      this.loading = true;
      this.authService.resetPassword(this.resetForm.value,this.id,this.resetToken).pipe(
          finalize(() => {
            this.loading = false;
          })
        ).subscribe((res: any) => {
          this.successMessage = 'ØªÙ… ØªØ¹Ø¯ÙŠÙ„  ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø±';
        }, (err => {
          if(err.status === 404) {
            this.errorMessage = 'Ø§Ù†ØªÙ‡Øª ØµÙ„Ø§Ø­ÙŠØ© Ø±Ø§Ø¨Ø· ØªØ¹Ø¯ÙŠÙ„ ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø±ØŒ Ù…Ù† ÙØ¶Ù„Ùƒ Ù‚Ù… Ø¨Ø·Ù„Ø¨ ØªØºÙŠÙŠØ± ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø± Ù…Ø±Ø© Ø£Ø®Ø±Ù‰';
          } else {
            this.errorMessage = 'ÙŠÙˆØ¬Ø¯ Ù…Ø´ÙƒÙ„Ø© ÙÙŠ Ø§Ù„Ø³ÙŠØ±ÙØ±ØŒ Ù…Ù† ÙØ¶Ù„Ùƒ Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰';
          }
        }));

    }
  }

}


