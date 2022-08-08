import { Injectable } from "@angular/core";
import { AngularFireRemoteConfig } from "@angular/fire/remote-config";
import { ReplaySubject } from "rxjs";
import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class RemoteConfigService {
  private featureFlags;
  private subject = new ReplaySubject(1);
  constructor(private remoteConfig: AngularFireRemoteConfig) {}
  initializeFeatureFlags() {
    this.remoteConfig.booleans.subscribe(
      (remoteconfigParams) => {
        this.featureFlags = remoteconfigParams;
        this.remoteConfig.lastFetchStatus.then(() => this.subject.next());
      },
      (err) => console.log("err", err)
    );
  }
  getFeatureFlags(featureName: string) {
    return this.subject.pipe(map(() => this.featureFlags[featureName]));
  }
}
