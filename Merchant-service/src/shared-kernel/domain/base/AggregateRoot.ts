export interface DomainEvent {}
export interface ValueObject {}
export interface DomainEntity {}
export abstract class AggregateRoot {
  private occurredEvents: DomainEvent[] = [];
  raiseEvent(domainEvent: DomainEvent) {
    this.occurredEvents.push(domainEvent);
  }
  getOccurredEvents(): DomainEvent[] {
    return [...this.occurredEvents];
  }

  public clone<T>(): T {
    return <T>JSON.parse(JSON.stringify(this));
  }
}


