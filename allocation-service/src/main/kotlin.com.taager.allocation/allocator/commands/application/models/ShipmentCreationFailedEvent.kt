package com.taager.allocation.allocator.commands.application.models
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.domain.models.valueobjects.ShippingCompany
data class ShipmentCreationFailedEvent(
    val shippingCompany: ShippingCompany,
    val orderIds: List<OrderId>
)
