package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.ShipmentDeletedEvent
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.exceptions.OrderNotFoundException
import com.taager.allocation.sharedkernel.application.EventHandler
import org.springframework.stereotype.Service
@Service
class ShipmentDeletedHandler(private val orderRepo: OrderRepo) : EventHandler<ShipmentDeletedEvent, Unit>() {
    override fun handle(event: ShipmentDeletedEvent) {
        logger.debug("Update current status for order with orderId [${event.orderId}] with trackingNumber [${event.trackingId}] " + "to Confirmed again as shipment was deleted")
        try {
            val order = orderRepo.getById(event.orderId).orElseThrow { OrderNotFoundException(event.orderId) }
            order.onShipmentDeleted()
            orderRepo.save(order)
        } catch (exception: OrderNotFoundException) {
            logger.error("No order found matching orderId: [${event.orderId}]")
        }
    }
}