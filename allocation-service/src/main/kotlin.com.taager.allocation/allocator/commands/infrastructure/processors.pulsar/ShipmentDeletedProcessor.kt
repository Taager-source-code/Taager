package com.taager.allocation.allocator.commands.infrastructure.processors.pulsar
import com.fasterxml.jackson.databind.ObjectMapper
import com.taager.allocation.allocator.commands.application.models.ShipmentDeletedEvent
import com.taager.allocation.allocator.commands.application.usecases.ShipmentDeletedHandler
import com.taager.allocation.allocator.commands.domain.events.ShipmentEvent
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.domain.models.valueobjects.TrackingId
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarProcessor
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarTools
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
@Component
class ShipmentDeletedProcessor(
    private val shipmentDeletedHandler: ShipmentDeletedHandler,
    pulsarTools: PulsarTools,
    @Value("\${pulsar.shipments.topic-uri-prefix}") topicUriPrefix: String,
    @Value("\${pulsar.subscription}") subscription: String,
    @Value("\${pulsar.shipments.topic.shipments-deleted}") topic: String,
    jsonMapper : ObjectMapper
) :
    PulsarProcessor<ShipmentDeletedDto>(ShipmentDeletedDto::class, pulsarTools, topicUriPrefix, topic, subscription, jsonMapper) {
    override fun execute(message: ShipmentDeletedDto) {
        val shipmentDeletedRequest = toDomain(message)
        shipmentDeletedHandler.handle(shipmentDeletedRequest)
    }
    private fun toDomain(message: ShipmentDeletedDto): ShipmentDeletedEvent {
        return ShipmentDeletedEvent(
            orderId = OrderId(message.orderId),
            trackingId = TrackingId(message.trackingId),
        )
    }
}
data class ShipmentDeletedDto(
    val orderId: String,
    val trackingId: String,
    val shippingCompany: String,
): ShipmentEvent
