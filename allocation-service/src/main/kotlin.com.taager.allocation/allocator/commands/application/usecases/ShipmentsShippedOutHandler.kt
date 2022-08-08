package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.ShipmentShippedOutEvent
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.exceptions.OrderNotFoundException
import com.taager.allocation.sharedkernel.application.EventHandler
import org.springframework.stereotype.Service
@Service
class ShipmentsShippedOutHandler(private val orderRepo: OrderRepo) : EventHandler<ShipmentShippedOutEvent, Unit>() {
    override fun handle(event: ShipmentShippedOutEvent) {
        logger.debug("Update current status for order with orderId [${event.orderId}] to Shipped_out")
        try {
            val order = orderRepo.getById(event.orderId).orElseThrow { OrderNotFoundException(event.orderId) }
            order.onShipmentShippedOut(event.updatedAt.value)
            orderRepo.save(order)
        } catch (exception: OrderNotFoundException) {
            logger.error("No order found matching orderId: [${event.orderId}]")
        }
    }
}