package com.taager.allocation.allocator.commands.domain.application.models
import com.taager.allocation.allocator.commands.domain.application.models.valueobjects.AllocationStatus
data class UpdateAllocationStatusRequest (val status: AllocationStatus)