import { Component } from "@angular/core";
import { AngularFireAnalytics } from "@angular/fire/analytics";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { ResponsiveService } from "../../dashboard/services/responsive.service";
import { ISAuthenticatedService } from "../../Services/isAuth.service";
@Component({
  styleUrls: ["login.component.scss"],
  templateUrl: "login.component.html",
})
export class LoginComponent {
  public queryString: any;
  public accountType: any;
  public wallet: any;
  public submitted = false;
  public countorders: number;
  public deliveredorders: number;
  public clicked = false;
  public loading = false;
  public isMobile: boolean;
  public errorMessage = "";
  public loginForm: FormGroup = new FormGroup({
    mobile: new FormControl("", [
      Validators.required,
      Validators.pattern("(01)[0-9]{9}"),
    ]),
    password: new FormControl("", [Validators.required]),
  });
  constructor(
    private routes: ActivatedRoute,
    private angularFireAnalytics: AngularFireAnalytics,
    private auth: AuthService,
    private isAuth: ISAuthenticatedService,
    private route: Router,
    private responsiveService: ResponsiveService
  ) {}
  ngOnInit(): void {
    this.getIsMobile();
    this.routes.queryParams.subscribe((params) => {
      this.queryString = params;
    });
  }
  get mobile(): AbstractControl {
    return this.loginForm.get("mobile");
  }
  get password(): AbstractControl {
    return this.loginForm.get("password");
  }
  getIsMobile(): void {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }
  private getCategory(string) {
    let decoded = decodeURIComponent(string);
    let split1 = decoded.split("?", 2);
    let split2 = split1[1].split("&", 3);
    let category_split = split2[1].split("=", 2);
    let page_split = split2[2].split("=", 2);
    let page = page_split[1];
    let category = category_split[1];
    const queryString2 = {
      q: "",
      category: category,
      currentPage: page,
    };
    return queryString2;
  }
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = "";
    // TODO: Use EventEmitter with form value
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.auth
      .login({
        username: this.loginForm.value.mobile, // tbc replace username with mobile
        password: this.loginForm.value.password,
        rememberMe: false,
      })
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        async (res: any) => {
          this.isAuth.setStorage("user", res.data);
          this.angularFireAnalytics.setUserProperties(res.user);
          this.angularFireAnalytics.setUserId(res.user.TagerID);
          this.angularFireAnalytics.logEvent("user_login", res.user);
          const redirectUrl = this.isAuth.getStorage("redirectUrl");
          if (redirectUrl) {
            if (redirectUrl.indexOf("category") != -1) {
              let queryCat = this.getCategory(redirectUrl);
              this.route.navigate(["/admin"], { queryParams: queryCat });
              this.isAuth.deleteStorage("redirectUrl");
            } else {
              this.route.navigate([redirectUrl]);
              this.isAuth.deleteStorage("redirectUrl");
            }
          } else {
            this.route.navigate(["admin"], {
              queryParams: this.queryString,
            });
          }
        },
        (err) => {
          if (err.status === 401) {
            this.errorMessage = "رقم الموبايل أو كلمة المرور غير صحيحة";
          } else if (err.status === 404) {
            this.errorMessage = "رقم الموبايل أو كلمة المرور غير صحيحة";
          } else if (err.status === 403) {
            this.errorMessage = "غير مصرح لك بالدخول هنا";
          } else {
            this.errorMessage = "يوجد مشكلة في السيرفر، من فضلك حاول مرة أخرى";
          }
        }
      );
  }
}
