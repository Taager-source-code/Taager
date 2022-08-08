package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.OrderUnConfirmedEvent
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.exceptions.OrderNotFoundException
import com.taager.allocation.sharedkernel.application.EventHandler
import org.springframework.stereotype.Service
@Service
class OrderUnConfirmedHandler(
    private val orderRepo: OrderRepo
) : EventHandler<OrderUnConfirmedEvent, Unit>() {
    override fun handle(event: OrderUnConfirmedEvent) {
        logger.debug("Removing order with id: [${event.orderId}] from db as it is un-confirmed")
        try {
            val order = orderRepo.getById(event.orderId).orElseThrow { OrderNotFoundException(event.orderId) }
            orderRepo.delete(order)
        } catch (exception: OrderNotFoundException) {
            logger.error("No order found matching orderId: [${event.orderId}]")
        }
    }
}