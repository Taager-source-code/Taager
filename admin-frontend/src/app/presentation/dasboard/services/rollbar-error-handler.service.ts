import { Inject, Injectable, InjectionToken } from "@angular/core";
import { AngularFireAnalytics } from "@angular/fire/analytics";
import * as Rollbar from "rollbar";
export const RollbarService = new InjectionToken<Rollbar>("rollbar");
@Injectable({
  providedIn: "root",
})
export class RollbarErrorHandlerService {
  constructor(
    @Inject(RollbarService) private rollbar: Rollbar,
    private angularFireAnalytics: AngularFireAnalytics
  ) {}
  handleError(err: any): void {
    const error = err.originalError || err;
    this.angularFireAnalytics.logEvent("rollbar_error", error);
    this.rollbar.error(error);
  }
}
