package com.taager.allocation.allocator.commands.domain.application.models.valueobjects
import com.taager.allocation.allocator.commands.domain.exceptions.InvalidAllocationStatusException
data class AllocationStatus(val value: String) {
    init {
        if (value != ENABLED && value != DISABLED)
            throw InvalidAllocationStatusException(value)
    }
    companion object {
        const val ENABLED = "ENABLED"
        const val DISABLED = "DISABLED"
        fun of(value: String): AllocationStatus = AllocationStatus(value)
    }
}