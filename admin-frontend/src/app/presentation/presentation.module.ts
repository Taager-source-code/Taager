import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { SETTINGS as ANGULAR_REMOTE_CONFIG_SETTINGS } from "@angular/fire/remote-config";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { WebComponentsModule } from "@taager-webapp/web-components";
import {
  PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG,
} from "ngx-perfect-scrollbar";
import { environment } from "src/environments/environment";
import { DataModule } from "../data/data.module";
import { CountryDropDownModule } from "./shared/country-dropdown/country-dropdown.module";
import { SharedModule } from "./shared/shared.module";
import { HttpRequestInterceptor } from "./dashboard/services/HttpRequestInterceptor.service";
import { NotificationsService } from "./dashboard/services/notifications.service";
import { ProfileService } from "./dashboard/services/profile.service";
import { ShippingService } from "./dashboard/services/shipping.service";
import { LoggedInGuard } from "./guards/loggedIn.guards";
import { AuthGuard } from "./guards/private.guard";
import { FooterComponent } from "./layout/footer/footer.component";
import { HeaderComponent } from "./layout/header/header.component";
import { MaterialModule } from "./material.module";
import { PresentationRoutingModule } from "./presentation.routing.module";
import { ISAuthenticatedService } from "./Services/isAuth.service";
import { ThirdPartyModule } from "./third-party.module";
import { AuthAppGuard } from "./guards/auth-app-guard";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};
const angularRemoteConfigSettingsFactory = () => {
  return environment.production
    ? {
        minimumFetchIntervalMillis: 0,
        fetchTimeoutMillis: 60000, // 1 minute
      }
    : {
        minimumFetchIntervalMillis: 0,
        fetchTimeoutMillis: 60000, // 1 minute
      };
};
const angularRemoteConfigSettingsProvider = {
  provide: ANGULAR_REMOTE_CONFIG_SETTINGS,
  useFactory: angularRemoteConfigSettingsFactory,
};
@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  exports: [HeaderComponent, FooterComponent],
  imports: [
    // external imports
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    ThirdPartyModule,
    WebComponentsModule,
    // local imports
    SharedModule,
    DataModule,
    PresentationRoutingModule,
    /**
     * TODO:
     *
     * pending disucssion
     *
     * for now, the modules will be placed here as is, and later after discussion,
     * moved to the repsective module.
     */
    CountryDropDownModule, // this should be moved onto the shared module
  ],
  providers: [
    AuthGuard,
    ISAuthenticatedService,
    ProfileService,
    ShippingService,
    LoggedInGuard,
    AuthAppGuard,
    NotificationsService,
    angularRemoteConfigSettingsProvider,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
  ],
})
export class PresentationModule {}
