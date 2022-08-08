import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularModule } from "../angular.module";
import { MaterialModule } from "../material.module";
import { SharedModule } from "../shared/shared.module";
import { AuthRoutingModule } from "./auth.routing.module";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LoginComponent } from "./login/login.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { AuthService } from "./services/auth.service";
@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    SharedModule,
    AngularModule,
    MaterialModule,
  ],
  providers: [AuthService],
})
export class AuthModule {}
