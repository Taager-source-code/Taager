package com.taager.allocation.allocator.commands.application.models
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.domain.models.valueobjects.UpdateTime
data class ShipmentShippedOutEvent(
    val orderId: OrderId,
    val updatedAt: UpdateTime
)