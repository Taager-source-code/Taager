package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.UnAllocateOrdersRequest
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.sharedkernel.application.UseCase
import org.springframework.stereotype.Service
@Service
class UnAllocateOrders(val orderRepo: OrderRepo) : UseCase<UnAllocateOrdersRequest, List<OrderId>>() {
    override fun execute(request: UnAllocateOrdersRequest): List<OrderId> {
        logger.debug("Un-allocating orders (changing status back to CONFIRMED)")
        val orders = orderRepo.getByIds(request.orderIds)
        orders.map { it.unAllocate() }
        val orderIds = orders.map { it.orderId }
        orderRepo.saveAll(orders)
        return request.orderIds.filterNot { orderIds.contains(it) }
    }
}