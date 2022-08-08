package com.taager.allocation.allocator.commands.infrastructure.publishers.pulsar
import com.taager.allocation.allocator.commands.application.contracts.AllocationCompletedPublisher
import com.taager.allocation.allocator.commands.domain.events.AllocationCompleted
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarPublisher
import com.taager.allocation.sharedkernel.infrastructure.pulsar.PulsarTools
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
@Component
class AllocationCompletedPublisherImpl(
    pulsarTools: PulsarTools,
    @Value("\${pulsar.order-management.topic-uri-prefix}") topicUriPrefix: String,
    @Value("\${pulsar.order-management.topic.order-allocation-completed}") topic: String,
): AllocationCompletedPublisher {
    private val orderAllocationCompletedPub =
        PulsarPublisher(OrderAllocationCompletedDto::class, pulsarTools, topicUriPrefix, topic)
    override fun publish(message: AllocationCompleted) {
             orderAllocationCompletedPub.publish(
                 OrderAllocationCompletedDto(
                    completedAt = message.completedAt.value
                )
            )
    }
}
data class OrderAllocationCompletedDto(
    val completedAt: Long
)