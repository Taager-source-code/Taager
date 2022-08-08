package com.taager.allocation.allocator.queries.application.models
data class GetAllocatorResponse(
    val status: AllocatorStatus
)
enum class AllocatorStatus {
    ENABLED, DISABLED
}