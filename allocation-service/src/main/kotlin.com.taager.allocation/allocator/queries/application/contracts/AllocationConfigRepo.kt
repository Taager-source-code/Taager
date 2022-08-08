package com.taager.allocation.allocator.queries.application.contracts
import com.taager.allocation.allocator.queries.application.models.AllocatorStatus
interface AllocationConfigRepo {
    fun getAllocatorStatus(): AllocatorStatus
}