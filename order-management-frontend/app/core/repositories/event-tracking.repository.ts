import { Observable } from 'rxjs';
export abstract class EventTrackingRepository {
  abstract track(eventName: string, properties?: any): Observable<boolean>;
}
