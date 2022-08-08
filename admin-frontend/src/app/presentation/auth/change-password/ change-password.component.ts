import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../../environments/environment";
@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  private url: string = environment.BACKEND_URL;
  public form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private toast: ToastrService
  ) {}
  ngOnInit() {
    this.initForm();
  }
  private initForm(): void {
    this.form = new FormGroup(
      {
        currentPassword: new FormControl(this.data.currentPassword, [
          Validators.required,
        ]),
        newPassword: new FormControl(this.data.newPassword, [
          Validators.required,
          Validators.minLength(9),
        ]),
        confirmPassword: new FormControl(this.data.confirmPassword, [
          Validators.required,
        ]),
      },
      { validators: this.passwordMatchCheck.bind(this) }
    );
  }
  passwordMatchCheck(formGroup: FormGroup) {
    const { value: newPassword } = formGroup.get("newPassword");
    const { value: confirmPassword } = formGroup.get("confirmPassword");
    return newPassword === confirmPassword ? null : { passwordNotMatch: true };
  }
  get newPassword(): AbstractControl {
    return this.form.get("newPassword");
  }
  public onNoClick(): void {
    this.dialogRef.close();
  }
  public onConfirm() {
    if (this.form.errors || this.form.invalid) {
      return;
    } else {
      this.http
        .patch(this.url + "api/auth/changePassword", this.form.value)
        .subscribe(
          (res: any) => {
            this.toast.success("تم تعديل  كلمة السر");
            this.onNoClick();
          },
          (err) => {
            if (err.status === 403) {
              this.toast.error("كلمة السر خاطئة");
            } else {
              this.toast.error("يوجد مشكلة في السيرفر، من فضلك حاول مرة أخرى");
            }
          }
        );
    }
  }
}
