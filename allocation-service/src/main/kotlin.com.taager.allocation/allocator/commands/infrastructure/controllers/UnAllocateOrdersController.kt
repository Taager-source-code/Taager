package com.taager.allocation.allocator.commands.infrastructure.controllers
import com.taager.allocation.allocator.commands.application.models.UnAllocateOrdersRequest
import com.taager.allocation.allocator.commands.application.usecases.UnAllocateOrders
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.openapi.api.UnAllocateOrdersApi
import com.taager.allocation.openapi.model.OrderDTO
import com.taager.allocation.openapi.model.OrdersNotFoundDTO
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
@RestController
class UnAllocateOrdersController(private val unAllocateOrders: UnAllocateOrders) : UnAllocateOrdersApi {
    override fun unAllocateOrders(orderDTO: List<OrderDTO>): ResponseEntity<OrdersNotFoundDTO> {
        val unallocatedOrders =  unAllocateOrders.execute(UnAllocateOrdersRequest(orderIds = orderDTO.map { OrderId(it.orderId) }))
        val ordersNotFoundDTO = OrdersNotFoundDTO(
            msg = "Listed orders were not found in DB, rest were un-allocated",
            orderIds = unallocatedOrders.map { OrderDTO(it.value) }
        )
        return ResponseEntity(ordersNotFoundDTO, HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [UnAllocateOrdersController::class])
class UnAllocateOrdersControllerAdvice {}