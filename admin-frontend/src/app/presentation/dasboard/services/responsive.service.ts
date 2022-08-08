import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
@Injectable({ providedIn: "root" })
export class ResponsiveService {
  private isMobile: boolean;
  private isTablet: boolean;
  public screenWidth: string;
  constructor() {
    this.checkWidth();
  }
  onMobileChange(status: boolean): void {
    this.isMobile = status;
  }
  getMobileStatus(): Observable<any> {
    return of(this.isMobile);
  }
  ontabletChange(status: boolean) {
    this.isTablet = status;
  }
  gettabletStatus(): Observable<any> {
    return of(this.isTablet);
  }
  public checkWidth() {
    const width = window.innerWidth;
    if (width <= 900) {
      this.screenWidth = "sm";
      this.onMobileChange(true);
    } else if (width > 900 && width <= 1400) {
      this.screenWidth = "md";
      this.onMobileChange(false);
      this.ontabletChange(true);
    } else {
      this.screenWidth = "lg";
      this.onMobileChange(false);
    }
  }
}
