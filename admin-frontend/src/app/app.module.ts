import { BrowserModule } from "@angular/platform-browser";
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  ErrorHandler,
  Inject,
  Injectable,
  InjectionToken,
} from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
import {
  AngularFireRemoteConfigModule,
  SETTINGS,
} from "@angular/fire/remote-config";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import * as Rollbar from "rollbar";

import { AppComponent } from "./app.component";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { environment } from "src/environments/environment";
import { PresentationModule } from "./presentation/presentation.module";
import { RouterModule } from "@angular/router";
import { HttpRequestInterceptor } from "./presentation/dashboard/services/HttpRequestInterceptor.service";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CollapseModule } from "ngx-bootstrap/collapse";
import {
  RollbarErrorHandlerService,
  RollbarService,
} from "./presentation/dashboard/services/rollbar-error-handler.service";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

const rollbarConfig = {
  accessToken: environment.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
};

export function rollbarFactory() {
  return new Rollbar(rollbarConfig);
}

const ROLLBAR_POVIDERS = environment.production
  ? [
      { provide: ErrorHandler, useClass: RollbarErrorHandlerService },
      { provide: RollbarService, useFactory: rollbarFactory },
    ]
  : [];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    PresentationModule,
    RouterModule.forRoot([]),
    ToastrModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AngularFireAuthModule,
    AngularFireRemoteConfigModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),

    // Clean Architecture starts here
    PresentationModule,
    RouterModule.forRoot([]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: SETTINGS,
      useFactory: () =>
        environment.production
          ? {
              minimumFetchIntervalMillis: 0,
              fetchTimeoutMillis: 60000, // 1 minute
            }
          : {
              minimumFetchIntervalMillis: 0,
              fetchTimeoutMillis: 60000, // 1 minute
            },
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    ...ROLLBAR_POVIDERS,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
