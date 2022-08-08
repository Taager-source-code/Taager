package com.taager.allocation.allocator.common.infrastructure.db.converters
import com.taager.allocation.allocator.commands.domain.models.Order
import com.taager.allocation.allocator.commands.domain.models.OrderLine
import com.taager.allocation.allocator.commands.domain.models.OrderStatus
import com.taager.allocation.allocator.common.infrastructure.db.enums.AllocationOrderStatus
import com.taager.allocation.allocator.common.infrastructure.db.models.OrderDbo
import com.taager.allocation.allocator.common.infrastructure.db.models.OrderLineDbo
import org.springframework.stereotype.Component
import java.sql.Timestamp
import java.util.*
@Component
class OrderToDbConverter {
    fun convert(order: Order): OrderDbo {
        val orderDbo = OrderDbo(
            orderId = order.orderId.value,
            orderLine = mutableListOf(),
            country = order.countryIso.value,
            zoneId = order.zoneId.value,
            companyId = order.companyId.let { order.companyId?.value },
            priorityId = order.priorityId.let { order.priorityId?.value },
            taagerId = order.tagerId.value,
            cashOnDelivery = order.cashOnDelivery.value,
            status = convertStatus(order.status),
            placedAt = Timestamp(order.placedAt.value.value),
            confirmedAt = Timestamp(order.confirmedAt.value.value),
            allocatedAt = order.allocatedAt.let { order.allocatedAt?.value?.let { it1 -> Timestamp(it1.value) } },
            shippedOutAt = order.shippedOutAt.let { order.shippedOutAt?.value?.let { it2 -> Timestamp(it2.value) } }
        )
        orderDbo.orderLine.addAll(convertOrderLines(orderDbo, order.orderLines))
        return orderDbo
    }
    private fun convertStatus(domainStatus: OrderStatus) = when (domainStatus) {
        OrderStatus.CONFIRMED -> AllocationOrderStatus.CONFIRMED
        OrderStatus.ALLOCATED -> AllocationOrderStatus.ALLOCATED
        OrderStatus.SHIPPED_OUT -> AllocationOrderStatus.SHIPPED_OUT
        OrderStatus.CANCELED -> AllocationOrderStatus.CANCELED
    }
    private fun convertOrderLines(orderDbo: OrderDbo, orderLines: List<OrderLine>) =
        orderLines.mapIndexed { _, it ->
            OrderLineDbo(
                id = UUID.randomUUID(),
                productId = it.productId.value,
                price = it.price.value,
                quantity = it.quantity.value,
                orderId = orderDbo
            )
        }.toMutableList()
}
