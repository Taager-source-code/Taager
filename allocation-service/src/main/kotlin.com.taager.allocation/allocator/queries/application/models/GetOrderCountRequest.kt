package com.taager.allocation.allocator.queries.application.models
import com.taager.allocation.allocator.commands.domain.models.OrderStatus
import com.taager.allocation.sharedkernel.domain.models.valueobjects.FilterDate
data class GetOrderCountRequest(
    val status: OrderStatus,
    val fromDate: FilterDate,
    val toDate: FilterDate
)