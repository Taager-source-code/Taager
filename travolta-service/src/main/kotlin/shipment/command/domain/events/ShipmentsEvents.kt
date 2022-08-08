package com.taager.travolta.shipment.command.domain.events
import com.taager.ddd.models.base.DomainEvent
import com.taager.travolta.sharedkernel.domain.models.Moment
import com.taager.travolta.shipment.command.domain.models.shipment.OrderId
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
sealed class ShipmentEvent : DomainEvent
data class ShipmentReadyToShipEvent(val trackingId: TrackingId, val orderId: OrderId, val updatedAt: Moment) : ShipmentEvent()
data class ShipmentShippedOutEvent(val trackingId: TrackingId, val orderId: OrderId, val updatedAt: Moment) : ShipmentEvent()
data class ShipmentReturnedEvent(val trackingId: TrackingId, val orderId: OrderId, val updatedAt: Moment) : ShipmentEvent()
data class ShipmentDelayedEvent(val trackingId: TrackingId, val orderId: OrderId, val updatedAt: Moment) : ShipmentEvent()
