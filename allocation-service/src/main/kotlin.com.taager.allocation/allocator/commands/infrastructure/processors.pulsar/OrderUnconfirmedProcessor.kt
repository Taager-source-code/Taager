package com.taager.allocation.allocator.commands.infrastructure.processors.pulsar
import com.fasterxml.jackson.databind.ObjectMapper
import com.taager.allocation.allocator.commands.application.models.OrderUnConfirmedEvent
import com.taager.allocation.allocator.commands.application.usecases.OrderUnConfirmedHandler
import com.taager.allocation.allocator.commands.domain.events.OrderEvent
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarProcessor
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarTools
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
@Component
class OrderUnconfirmedProcessor(
    private val orderUnConfirmedHandler: OrderUnConfirmedHandler,
    pulsarTools: PulsarTools,
    @Value("\${pulsar.order-management.topic-uri-prefix}") topicUriPrefix: String,
    @Value("\${pulsar.subscription}") subscription: String,
    @Value("\${pulsar.order-management.topic.order-unconfirmed}") topic: String,
    jsonMapper: ObjectMapper
) :
    PulsarProcessor<OrderUnConfirmedReceivingDto>(OrderUnConfirmedReceivingDto::class, pulsarTools, topicUriPrefix, topic, subscription, jsonMapper) {
    override fun execute(message: OrderUnConfirmedReceivingDto) {
        val orderUnConfirmedRequest = toDomain(message)
        orderUnConfirmedHandler.handle(orderUnConfirmedRequest)
    }
    private fun toDomain(message: OrderUnConfirmedReceivingDto) : OrderUnConfirmedEvent {
        return OrderUnConfirmedEvent(orderId = OrderId(value = message.orderBusinessId))
    }
}
data class OrderUnConfirmedReceivingDto(
    val orderBusinessId: String,
    ): OrderEvent