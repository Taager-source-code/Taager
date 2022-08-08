package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.ShipmentWarehouseCancelledEvent
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.exceptions.OrderNotFoundException
import com.taager.allocation.sharedkernel.application.EventHandler
import org.springframework.stereotype.Service
@Service
class ShipmentWarehouseCancelledHandler(private val orderRepo: OrderRepo) :
    EventHandler<ShipmentWarehouseCancelledEvent, Unit>() {
    override fun handle(event: ShipmentWarehouseCancelledEvent) {
        logger.debug("Update current status for order with orderId [${event.orderId}] to Cancelled")
        try {
            val order = orderRepo.getById(event.orderId).orElseThrow { OrderNotFoundException(event.orderId) }
            order.onWarehouseCanceled()
            orderRepo.save(order)
        } catch (exception: OrderNotFoundException) {
            logger.error("No order found matching orderId: [${event.orderId}]")
        }
    }
}