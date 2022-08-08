package com.taager.allocation.allocator.commands.infrastructure.processors.pulsar
import com.fasterxml.jackson.databind.ObjectMapper
import com.taager.allocation.allocator.commands.application.models.OrderConfirmedEvent
import com.taager.allocation.allocator.commands.application.usecases.OrderConfirmedHandler
import com.taager.allocation.allocator.commands.domain.events.OrderEvent
import com.taager.allocation.allocator.commands.domain.models.*
import com.taager.allocation.sharedkernel.domain.models.Moment
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ProvinceName
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneName
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarProcessor
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarTools
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
@Component
class OrderConfirmedProcessor(
    private val orderConfirmedHandler: OrderConfirmedHandler,
    pulsarTools: PulsarTools,
    @Value("\${pulsar.order-management.topic-uri-prefix}") topicUriPrefix: String,
    @Value("\${pulsar.subscription}") subscription: String,
    @Value("\${pulsar.order-management.topic.order-confirmed}") topic: String,
    jsonMapper: ObjectMapper
) :
    PulsarProcessor<OrderConfirmedReceivingDto>(OrderConfirmedReceivingDto::class, pulsarTools, topicUriPrefix, topic, subscription, jsonMapper) {
    override fun execute(message: OrderConfirmedReceivingDto) {
        val orderConfirmedRequest = toDomain(message)
        orderConfirmedHandler.handle(orderConfirmedRequest)
    }
    private fun toDomain(message: OrderConfirmedReceivingDto) : OrderConfirmedEvent {
        var orderLines = message.orderLines.map { product ->
            OrderLine(
                productId = ProductId(value = product.productId),
                price = Price(value = product.price),
                quantity = Quantity(value = product.quantity)
            )
        }
        return OrderConfirmedEvent(
                orderId = OrderId(value = message.orderBusinessId),
                zoneName = ZoneName(value = message.orderZone),
                provinceName = ProvinceName(value = message.province),
                taagerId = TagerId(value = message.taagerId),
                countryIso = CountryIso(value = message.country),
                cashOnDelivery = CashOnDelivery(value = message.cashOnDelivery),
                placedAt = PlacedAt(value = Moment(message.creationDate)),
                confirmedAt = ConfirmedAt(value = Moment(message.confirmationDate)),
                orderLines = orderLines,
        )
    }
}
data class OrderConfirmedReceivingDto(
    val orderBusinessId: String,
    val orderZone: String,
    val province: String,
    val taagerId: Int,
    val country: String,
    val cashOnDelivery: Int,
    val creationDate: Long,
    val confirmationDate: Long,
    val orderLines: List<OrderLineDto>,
    ): OrderEvent
data class OrderLineDto(
    val productId: String,
    val price: Int,
    val quantity: Int
)
