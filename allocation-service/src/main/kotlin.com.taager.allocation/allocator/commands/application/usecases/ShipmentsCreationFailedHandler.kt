package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.ShipmentCreationFailedEvent
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.exceptions.OrderNotFoundException
import com.taager.allocation.allocator.commands.domain.models.Order
import com.taager.allocation.sharedkernel.application.EventHandler
import org.springframework.stereotype.Service
@Service
class ShipmentsCreationFailedHandler(private val orderRepo: OrderRepo): EventHandler<ShipmentCreationFailedEvent, Unit>() {
    override fun handle(event: ShipmentCreationFailedEvent) {
        logger.debug("Update order status back to Confirmed for failed shipments")
        val orderList: MutableList<Order> = mutableListOf();
        event.orderIds.map {
            try {
                val order = orderRepo.getById(it).orElseThrow{ OrderNotFoundException(it) }
                order.onShipmentFailedToCreate()
                orderList.add(order)
            } catch (exception: OrderNotFoundException) {
                logger.error("No order found matching orderId: [${it}]")
            }
        }
        orderRepo.saveAll(orderList)
    }
}