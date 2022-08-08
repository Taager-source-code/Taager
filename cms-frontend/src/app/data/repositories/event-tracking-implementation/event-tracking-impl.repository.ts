/* eslint-disable @typescript-eslint/naming-convention */
import { EventTrackingRepository } from '@core/repositories/event-tracking.repository';
import { environment } from '@environments/environment';
import mixpanel from 'mixpanel-browser';
import packageInfo from '../../../../../package.json';
export class EventTrackingRepositoryImpl extends EventTrackingRepository {
    constructor() {
        super();
        mixpanel.init(environment.MIXPANEL_PROJECT_TOKEN);
    }
    track(eventName: string, properties: any): void {
        const eventProperties = {
            ...properties,
            Version: packageInfo.version,
        };
        mixpanel.track(eventName, eventProperties);
    }
}
