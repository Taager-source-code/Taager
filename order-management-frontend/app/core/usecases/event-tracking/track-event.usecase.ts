import { UseCase } from '@core/base/use-case';
import { EventTrackingRepository } from '@core/repositories/event-tracking.repository';
import { Observable } from 'rxjs';
export class TrackEventUseCase implements UseCase<{eventName: string; properties?: any}, boolean> {
  constructor(private eventTrackingRepository: EventTrackingRepository) {}
  execute( params: {eventName: string; properties?: any} ): Observable<boolean> {
    const { eventName, properties } = params;
    return this.eventTrackingRepository.track(eventName, properties);
  }
}
