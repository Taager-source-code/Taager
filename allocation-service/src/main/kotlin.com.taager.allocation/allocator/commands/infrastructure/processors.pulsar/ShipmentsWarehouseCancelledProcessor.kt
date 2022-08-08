package com.taager.allocation.allocator.commands.infrastructure.processors.pulsar
import com.fasterxml.jackson.databind.ObjectMapper
import com.taager.allocation.allocator.commands.application.models.ShipmentWarehouseCancelledEvent
import com.taager.allocation.allocator.commands.application.usecases.ShipmentWarehouseCancelledHandler
import com.taager.allocation.allocator.commands.domain.events.ShipmentEvent
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.domain.models.valueobjects.TrackingId
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarProcessor
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarTools
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
@Component
class ShipmentsWarehouseCancelledProcessor(
    private val shipmentWarehouseCancelledHandler: ShipmentWarehouseCancelledHandler,
    pulsarTools: PulsarTools,
    @Value("\${pulsar.shipments.topic-uri-prefix}") topicUriPrefix: String,
    @Value("\${pulsar.subscription}") subscription: String,
    @Value("\${pulsar.shipments.topic.shipments-warehouse-cancelled}") topic: String,
    jsonMapper : ObjectMapper
) :
    PulsarProcessor<ShipmentWarehouseCancelledDto>(ShipmentWarehouseCancelledDto::class, pulsarTools, topicUriPrefix, topic, subscription, jsonMapper) {
    override fun execute(message: ShipmentWarehouseCancelledDto) {
        val shipmentWarehouseCancelledRequest = toDomain(message)
        shipmentWarehouseCancelledHandler.handle(shipmentWarehouseCancelledRequest)
    }
    private fun toDomain(message: ShipmentWarehouseCancelledDto): ShipmentWarehouseCancelledEvent {
        return ShipmentWarehouseCancelledEvent(
            orderId = OrderId(message.orderId),
            trackingId = TrackingId(message.trackingId),
        )
    }
}
data class ShipmentWarehouseCancelledDto(
    val orderId: String,
    val trackingId: String,
): ShipmentEvent
