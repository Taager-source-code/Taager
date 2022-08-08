export abstract class EventTrackingRepository {
  abstract track(eventName: string, properties?: any): void;
}
