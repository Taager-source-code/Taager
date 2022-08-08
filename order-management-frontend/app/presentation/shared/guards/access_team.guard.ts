import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
} from '@angular/router';
import { RemoteConfigService } from '@presentation/services/remote-config.service';
import * as FEATURE_FLAGS from '@data/constants/feature-flags';
import { BATCHES_URL, ELIGIBLE_ORDERS_URL, SHIPPING_CAPACITY_URL } from '@data/constants/app-routing-url';
@Injectable()
export class AccessTeamRouteGuard implements CanActivate {
    constructor(
        private router: Router,
        private remoteConfig: RemoteConfigService,
    ) { }
    canActivate(route: ActivatedRouteSnapshot) {
        let accessAllowed: boolean;
        let selectedFlag: string;
        const activatedRoute = route.routeConfig.path;
        if (activatedRoute === ELIGIBLE_ORDERS_URL) {
            selectedFlag = FEATURE_FLAGS.OM_AFTER_SALES_ACCESS;
        } else if (activatedRoute === SHIPPING_CAPACITY_URL || activatedRoute === BATCHES_URL) {
            selectedFlag = FEATURE_FLAGS.OM_SHIPPING_ACCESS;
        }
        this.remoteConfig.getFeatureFlags(selectedFlag).subscribe(flag => {
            accessAllowed = flag;
        });
        if (accessAllowed) {
            return true;
        } else {
            this.router.navigate(['/pages/misc/protected-page']);
        }
    }
}
