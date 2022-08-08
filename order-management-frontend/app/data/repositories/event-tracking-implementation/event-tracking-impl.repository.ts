/* eslint-disable @typescript-eslint/naming-convention */
import { EventTrackingRepository } from '@core/repositories/event-tracking.repository';
import { PROJECT_EVENT_NAME_PREFIX } from '@data/constants/event-tracking.constants';
import { environment } from '@environments/environment';
import mixpanel from 'mixpanel-browser';
import { Observable, of } from 'rxjs';
import packageInfo from '../../../../../package.json';
export class EventTrackingRepositoryImpl extends EventTrackingRepository {
    constructor() {
        super();
        mixpanel.init(environment.MIXPANEL_PROJECT_TOKEN);
    }
    track(eventName: string, properties: any): Observable<boolean> {
        const eventProperties = {
            ...properties,
            Version: packageInfo.version,
        };
        eventName = `${PROJECT_EVENT_NAME_PREFIX}_${eventName}`;
        mixpanel.track(eventName, eventProperties);
        return(of(true));
    }
}
