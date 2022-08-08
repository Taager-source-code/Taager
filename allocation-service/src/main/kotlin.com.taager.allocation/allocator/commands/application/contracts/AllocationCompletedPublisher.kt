package com.taager.allocation.allocator.commands.application.contracts
import com.taager.allocation.allocator.commands.domain.events.AllocationCompleted
interface AllocationCompletedPublisher {
    fun publish(allocationCompleted: AllocationCompleted)
}