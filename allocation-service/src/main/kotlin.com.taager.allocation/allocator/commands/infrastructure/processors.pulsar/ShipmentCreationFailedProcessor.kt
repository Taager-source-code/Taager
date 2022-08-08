package com.taager.allocation.allocator.commands.infrastructure.processors.pulsar
import com.fasterxml.jackson.databind.ObjectMapper
import com.taager.allocation.allocator.commands.application.models.ShipmentCreationFailedEvent
import com.taager.allocation.allocator.commands.application.usecases.ShipmentsCreationFailedHandler
import com.taager.allocation.allocator.commands.domain.events.ShipmentEvent
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.domain.models.valueobjects.ShippingCompany
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarProcessor
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarTools
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
@Component
class ShipmentCreationFailedProcessor(
    private val shipmentsCreationFailedHandler: ShipmentsCreationFailedHandler,
    pulsarTools: PulsarTools,
    @Value("\${pulsar.shipments.topic-uri-prefix}") topicUriPrefix: String,
    @Value("\${pulsar.subscription}") subscription: String,
    @Value("\${pulsar.shipments.topic.shipments-creation-failed}") topic: String,
    jsonMapper : ObjectMapper
) :
    PulsarProcessor<FailedShipmentReceivingDto>(FailedShipmentReceivingDto::class, pulsarTools, topicUriPrefix,topic, subscription, jsonMapper) {
    override fun execute(message: FailedShipmentReceivingDto) {
        val shipmentFailedRequest = toDomain(message)
        shipmentsCreationFailedHandler.handle(shipmentFailedRequest)
    }
    private fun toDomain(message: FailedShipmentReceivingDto): ShipmentCreationFailedEvent {
        val failedShipmentOrderIds = message.shipments.map { OrderId(it.orderId) }
        return ShipmentCreationFailedEvent(shippingCompany = ShippingCompany(message.shippingCompany), orderIds = failedShipmentOrderIds)
    }
}
data class FailedShipmentReceivingDto(
    val shippingCompany: String,
    val shipments: List<SingleShipmentDto>
) : ShipmentEvent
data class SingleShipmentDto(
    val orderId: String,
    val reason: String
)