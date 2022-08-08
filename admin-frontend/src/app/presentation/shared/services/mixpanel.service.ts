import { Injectable } from "@angular/core";
import * as mixpanel from "mixpanel-browser";
import { environment } from "src/environments/environment";
import { version } from "package.json";
@Injectable({
  providedIn: "root",
})
export class MixpanelService {
  init(): void {
    mixpanel.init(environment.MIXPANEL_PROJECT_TOKEN);
  }
  track(eventName: string, properties?: any): void {
    mixpanel.track(eventName, {
      ...properties,
      version,
      "User email": localStorage.getItem("user_email") ?? "null",
      "User phone number": localStorage.getItem("user_phonenumber") ?? "null",
    });
  }
}