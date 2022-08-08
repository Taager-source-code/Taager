import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
@Injectable()
export class NotificationsService {
  private readonly url: string;
  constructor(private http: HttpClient) {
    this.url = environment.BACKEND_URL;
  }
  createNotification(data): Observable<any> {
    const reqBody = {
      message: data.message,
      link: data.link,
      taagerId: data.taagerId,
      country: data.country,
    };
    const url = `${environment.BACKEND_URL}api/notifications`;
    return this.http.post(url, reqBody);
  }
  sendPushNotification(data): Observable<any> {
    const reqBody = {
      message: data.message,
      title: data.title,
      taagerId: data.taagerId,
    };
    const url = `${environment.BACKEND_URL}api/notifications/sendPush`;
    return this.http.post(url, reqBody);
  }
}
