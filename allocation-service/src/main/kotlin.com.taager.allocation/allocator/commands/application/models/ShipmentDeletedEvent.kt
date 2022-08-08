package com.taager.allocation.allocator.commands.application.models
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.domain.models.valueobjects.TrackingId
data class ShipmentDeletedEvent(
    val orderId: OrderId,
    val trackingId: TrackingId
)