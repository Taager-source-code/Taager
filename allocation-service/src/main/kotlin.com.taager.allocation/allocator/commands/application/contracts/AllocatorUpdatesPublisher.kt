package com.taager.allocation.allocator.commands.application.contracts
import com.taager.allocation.allocator.commands.application.models.AllocationResultConsolidated
interface AllocatorUpdatesPublisher {
    fun publishAllocatorStarted(ordersToAllocate: Int)
    fun publishAllocatorFailed(reason: String)
    fun publishAllocatorRunUpdate(result: AllocationResultConsolidated)
}