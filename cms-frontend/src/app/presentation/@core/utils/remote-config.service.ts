import { Injectable } from '@angular/core';
import { fetchAndActivate, getBoolean, RemoteConfig } from '@angular/fire/remote-config';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
@Injectable()
export class RemoteConfigService {
    private subject = new ReplaySubject(1);
    constructor(
        private remoteConfig: RemoteConfig,
    ) { }
    initializeFeatureFlags() {
        if (environment.remoteConfigFetchInterval) {
            this.remoteConfig.settings.minimumFetchIntervalMillis = environment.remoteConfigFetchInterval;
        }
        fetchAndActivate(this.remoteConfig).then(
            () => this.subject.next(),
        );
    }
    getFeatureFlags(featureName: string): Observable<boolean> {
        return this.subject.pipe(
            map(
                () => getBoolean(this.remoteConfig, featureName),
            ),
        );
    }
};
