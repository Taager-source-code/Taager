package com.taager.allocation.allocator.commands.infrastructure.processors.pulsar
import com.fasterxml.jackson.databind.ObjectMapper
import com.taager.allocation.allocator.commands.application.models.ShipmentShippedOutEvent
import com.taager.allocation.allocator.commands.application.usecases.ShipmentsShippedOutHandler
import com.taager.allocation.allocator.commands.domain.events.ShipmentEvent
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.domain.models.valueobjects.UpdateTime
import com.taager.allocation.sharedkernel.domain.models.Moment
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarProcessor
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarTools
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
@Component
class ShipmentShippedOutProcessor(
    private val shipmentsShippedOutHandler: ShipmentsShippedOutHandler,
    pulsarTools: PulsarTools,
    @Value("\${pulsar.shipments.topic-uri-prefix}") topicUriPrefix: String,
    @Value("\${pulsar.subscription}") subscription: String,
    @Value("\${pulsar.shipments.topic.shipments-shipped-out}") topic: String,
    jsonMapper : ObjectMapper
) :
    PulsarProcessor<ShipmentShippedOutDto>(ShipmentShippedOutDto::class, pulsarTools, topicUriPrefix, topic, subscription, jsonMapper) {
    override fun execute(message: ShipmentShippedOutDto) {
        val shipmentShippedOutRequest = toDomain(message)
        shipmentsShippedOutHandler.handle(shipmentShippedOutRequest)
    }
    private fun toDomain(message: ShipmentShippedOutDto): ShipmentShippedOutEvent {
        return ShipmentShippedOutEvent(
            orderId = OrderId(message.orderId),
            updatedAt = UpdateTime(Moment(message.updatedAt))
        )
    }
}
data class ShipmentShippedOutDto(
    val orderId: String,
    val trackingId: String,
    val updatedAt: Long
): ShipmentEvent