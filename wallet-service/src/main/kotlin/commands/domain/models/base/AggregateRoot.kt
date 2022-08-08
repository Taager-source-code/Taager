package com.taager.wallet.commands.domain.models.base
abstract class AggregateRoot<out T : ValueObject>(id: T) : Entity<T>(id)
{
    protected val occurredEvents: MutableList<DomainEvent> = mutableListOf()
    fun occurredEvents(): List<DomainEvent>
    {
        val events = this.occurredEvents.toMutableList()
        this.occurredEvents.clear()
        return events
    }
    protected fun raiseEvent(event: DomainEvent)
    {
        occurredEvents.add(event)
    }
}