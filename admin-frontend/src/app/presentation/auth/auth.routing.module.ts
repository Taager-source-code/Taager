import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { AuthAppGuard } from "../guards/auth-app-guard";
import { LoggedInGuard } from "../guards/loggedIn.guards";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LoginComponent } from "./login/login.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
/**
 * NOTE:
 *
 * This routing module is for authorization and authentication step. So, for future reference,
 * the reason that reset-password and forgot-password are put here is because these are the things
 * which the user can interact with then they are not logged in.
 *
 * Contrary to change-password (which is not there presently), change-password will be in the admin
 * section,once the user has logged in and can proceed with updating their password.
 */
const ROUTES: Array<Route> = [
  {
    path: "",
    canActivate: [LoggedInGuard],
    children: [
      { path: "login", component: LoginComponent, canActivate: [AuthAppGuard] },
      { path: "forgot-password", component: ForgotPasswordComponent },
      {
        path: "reset-password/:id/:resetToken",
        component: ResetPasswordComponent,
      },
      { path: "", redirectTo: "/login", pathMatch: "full" },
    ],
  },
];
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)],
})
export class AuthRoutingModule {}
