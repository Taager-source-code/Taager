package com.taager.allocation.allocator.commands.application.models
import com.taager.allocation.allocator.commands.domain.models.Zone
import com.taager.allocation.allocator.commands.domain.services.AllocationResult
data class AllocationResultConsolidated(
    val allocationResult: AllocationResult,
    val zones: List<Zone>
)
