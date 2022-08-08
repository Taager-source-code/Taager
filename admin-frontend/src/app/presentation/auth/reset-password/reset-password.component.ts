import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { ResponsiveService } from "../../dashboard/services/responsive.service";
import { AuthService } from "../services/auth.service";
@Component({
  styleUrls: ["reset-password.component.scss"],
  templateUrl: "reset-password.component.html",
})
export class ResetPasswordComponent {
  private id: string;
  private resetToken: string;
  public submitted = false;
  public errorMessage = "";
  public successMessage = "";
  public loading = false;
  public isMobile: boolean;
  public resetForm: FormGroup;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private responsiveService: ResponsiveService
  ) {
    this.resetForm = this.formBuilder.group(
      {
        password: new FormControl(
          "",
          Validators.compose([Validators.required, Validators.minLength(9)])
        ),
        confirmPassword: new FormControl(
          "",
          Validators.compose([Validators.required])
        ),
      },
      {
        validators: this.passwordMatchCheck.bind(this),
      }
    );
  }
  passwordMatchCheck(formGroup: FormGroup) {
    const { value: password } = formGroup.get("password");
    const { value: confirmPassword } = formGroup.get("confirmPassword");
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
    return this.resetForm.get("password");
  }
  get confirmPassword(): AbstractControl {
    return this.resetForm.get("confirmPassword");
  }
  public navigateToSignIn() {
    this.router.navigate(["login"]);
  }
  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = "";
    if (this.resetForm.invalid) {
      return;
    } else {
      this.loading = true;
      this.authService
        .resetPassword(this.resetForm.value, this.id, this.resetToken)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(
          (res: any) => {
            this.successMessage = "تم تعديل  كلمة السر";
          },
          (err) => {
            this.errorMessage = "يوجد مشكلة في السيرفر، من فضلك حاول مرة أخرى";
          }
        );
    }
  }
}
