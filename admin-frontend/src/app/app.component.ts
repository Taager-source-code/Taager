import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { environment } from "src/environments/environment";
import { VersionCheckService } from "./presentation/shared/services/version-check.service";
import { MixpanelService } from "./presentation/shared/services/mixpanel.service";
import { version } from "package.json";
import { RemoteConfigService } from "./presentation/shared/services/remote-config.service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "taager-admin";
  version = version;
  constructor(
    public router: Router,
    private versionCheckService: VersionCheckService,
    private mixpanelService: MixpanelService,
    private remoteConfigService: RemoteConfigService
  ) {}

  async ngOnInit() {
    this.remoteConfigService.initializeFeatureFlags();
    this.mixpanelService.init();
    this.versionCheckService
      .versionChange(environment.versionCheckURL)
      .subscribe(() => {
        localStorage.clear();
        location.reload();
      });
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
