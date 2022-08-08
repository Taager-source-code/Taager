package com.taager.allocation.allocator.commands.infrastructure.publishers.pulsar
import com.taager.allocation.allocator.commands.domain.events.OrderAllocated
import com.taager.allocation.allocator.commands.domain.events.OrderEvent
import com.taager.allocation.allocator.commands.domain.events.OrderUnAllocated
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarPublisher
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarTools
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
@Component
class OrderStatusChangedPublisher(
    pulsarTools: PulsarTools,
    @Value("\${pulsar.order-management.topic-uri-prefix}") topicUriPrefix: String,
    @Value("\${pulsar.order-management.topic.order-unallocated}") topicUnAllocate: String,
    @Value("\${pulsar.order-management.topic.order-allocated}") topicAllocate: String,
) {
    private val orderAllocatedPub =
        PulsarPublisher(OrderAllocatedDto::class, pulsarTools, topicUriPrefix, topicAllocate)
    private val orderUnAllocatedPub =
        PulsarPublisher(OrderUnAllocatedDto::class, pulsarTools, topicUriPrefix, topicUnAllocate)
    fun publish(message: OrderEvent) {
        when (message) {
            is OrderAllocated -> orderAllocatedPub.publish(
                OrderAllocatedDto(
                    orderId = message.orderId.value,
                    shippingCompanyId = message.companyId.value.toString(),
                    updatedAt = message.updatedAt.value
                )
            )
            is OrderUnAllocated -> orderUnAllocatedPub.publish(
                OrderUnAllocatedDto(
                    message.orderId.value,
                    message.updatedAt.value
                )
            )
        }
    }
}
data class OrderUnAllocatedDto(
    val orderId: String,
    val updatedAt: Long
)
data class OrderAllocatedDto(
    val orderId: String,
    val shippingCompanyId: String,
    val updatedAt: Long
)