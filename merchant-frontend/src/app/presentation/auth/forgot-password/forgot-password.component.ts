import { Component, OnInit } from '@angular/core';

import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

import { finalize } from 'rxjs/operators';

import { AuthService } from 'src/app/presentation/auth/services/auth.service';
import { ResponsiveService } from 'src/app/presentation/shared/services/responsive.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent  {
  public submitted = false;
  public errorMessage = '';
  public successMessage = '';
  public loading = false;
  public isMobile: boolean;

  public resetForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ])
  });

  constructor(private authService: AuthService, private responsiveService: ResponsiveService) {
  }

  ngOnInit(): void {
    this.getIsMobile();
  }

  get email(): AbstractControl {
    return this.resetForm.get('email');
  }

  getIsMobile(): void {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    if (this.resetForm.invalid) {
      return;
    } else {
      this.loading = true;
      this.authService.forgotPassword(this.resetForm.value).pipe(
          finalize(() => {
            this.loading = false;
          })
        ).subscribe((res: any) => {
          this.successMessage = 'ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø¥Ù…ÙŠÙ„  ØªØ¹Ø¯ÙŠÙ„  ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø± Ø¨Ù†Ø¬Ø§Ø­';
        }, (err => {
          if(err.status===404) {
            this.errorMessage = 'Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø£Ù„ÙƒØªØ±ÙˆÙ†Ù‰ ØºÙŠØ± Ù…Ø³Ø¬Ù„';
          } else{
            this.errorMessage = 'ÙŠÙˆØ¬Ø¯ Ù…Ø´ÙƒÙ„Ø© ÙÙŠ Ø§Ù„Ø³ÙŠØ±ÙØ±ØŒ Ù…Ù† ÙØ¶Ù„Ùƒ Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰';
          }
        }));

    }
  }

}


