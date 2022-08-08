/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
 import { Component, OnInit } from '@angular/core';
import { RemoteConfigService } from './presentation/services/remote-config.service';
import packageInfo from '../../package.json';
 @Component({
   selector: 'ngx-app',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
 })
 export class AppComponent implements OnInit {
  public version: string;
   constructor(
     private remoteConfigService: RemoteConfigService,
    ) {
   }
   ngOnInit(): void {
    this.remoteConfigService.initializeFeatureFlags();
    this.version = packageInfo.version;
   }
 }
