/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './presentation/@core/utils/analytics.service';
import { RemoteConfigService } from './presentation/@core/utils/remote-config.service';
@Component({
    selector: 'ngx-app',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
    constructor(
        private analytics: AnalyticsService,
        private remoteConfigService: RemoteConfigService,
    ) { }
    ngOnInit(): void {
        this.analytics.trackPageViews();
        this.remoteConfigService.initializeFeatureFlags();
    }
}
