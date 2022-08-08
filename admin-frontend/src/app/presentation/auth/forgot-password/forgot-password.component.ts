import { Component } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { finalize } from "rxjs/operators";
import { ResponsiveService } from "../../dashboard/services/responsive.service";
import { AuthService } from "../services/auth.service";
@Component({
  styleUrls: ["forgot-password.component.scss"],
  templateUrl: "forgot-password.component.html",
})
export class ForgotPasswordComponent {
  public submitted = false;
  public errorMessage = "";
  public successMessage = "";
  public loading = false;
  public isMobile: boolean;
  public resetForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });
  constructor(
    private authService: AuthService,
    private responsiveService: ResponsiveService
  ) {}
  ngOnInit(): void {
    this.getIsMobile();
  }
  get email(): AbstractControl {
    return this.resetForm.get("email");
  }
  getIsMobile(): void {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }
  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = "";
    this.successMessage = "";
    if (this.resetForm.invalid) {
      return;
    } else {
      this.loading = true;
      this.authService
        .forgotPassword(this.resetForm.value)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(
          (res: any) => {
            this.successMessage = "تم إرسال إميل  تعديل  كلمة السر بنجاح";
          },
          (err) => {
            if (err.status === 404) {
              this.errorMessage = "بريد الألكترونى غير مسجل";
            } else {
              this.errorMessage =
                "يوجد مشكلة في السيرفر، من فضلك حاول مرة أخرى";
            }
          }
        );
    }
  }
}
