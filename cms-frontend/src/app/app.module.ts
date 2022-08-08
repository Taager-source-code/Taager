/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './presentation/@core/core.module';
import { ThemeModule } from './presentation/@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { DataModule } from './data/data.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { SETTINGS } from '@angular/fire/compat/remote-config';
import { TokenInterceptor } from '@presentation/@core/interceptor/token.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AngularFirePerformanceModule, PerformanceMonitoringService } from '@angular/fire/compat/performance';
import { AngularFireModule } from '@angular/fire/compat';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    DataModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirePerformanceModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideRemoteConfig(() => getRemoteConfig()),
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: SETTINGS,
      useValue: () =>
        environment.production
          ? {
            minimumFetchIntervalMillis: 3600000, // 1hr
          }
          : {
            minimumFetchIntervalMillis: 180000, // 3 minutes
          },
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    PerformanceMonitoringService,
  ],
})
export class AppModule {
}
