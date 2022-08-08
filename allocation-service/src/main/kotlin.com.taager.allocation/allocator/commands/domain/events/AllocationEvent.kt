package com.taager.allocation.allocator.commands.domain.events
import com.taager.allocation.sharedkernel.domain.models.Moment
import com.taager.allocation.sharedkernel.domain.models.base.DomainEvent
interface AllocationEvent : DomainEvent
data class AllocationCompleted(val completedAt: Moment) : OrderEvent