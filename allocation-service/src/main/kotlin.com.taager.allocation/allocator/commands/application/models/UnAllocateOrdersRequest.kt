package com.taager.allocation.allocator.commands.application.models
import com.taager.allocation.allocator.commands.domain.models.OrderId
data class UnAllocateOrdersRequest(
    val orderIds: List<OrderId>
)