package com.taager.allocation.allocator.commands.domain.contracts
import com.taager.allocation.allocator.commands.domain.application.models.valueobjects.AllocationStatus
interface AllocationConfigRepo {
    fun updateAllocationStatus(status: AllocationStatus)
    fun updateAllocationRunTime()
    fun allocatorIsEnabled(): Boolean
}