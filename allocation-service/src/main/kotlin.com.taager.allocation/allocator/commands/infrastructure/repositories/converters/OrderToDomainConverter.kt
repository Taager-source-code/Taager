package com.taager.allocation.allocator.commands.infrastructure.repositories.converters
import com.taager.allocation.allocator.commands.domain.models.*
import com.taager.allocation.allocator.common.infrastructure.db.enums.AllocationOrderStatus
import com.taager.allocation.allocator.common.infrastructure.db.models.OrderDbo
import com.taager.allocation.sharedkernel.domain.models.Moment
import org.springframework.stereotype.Component
@Component
class OrderToDomainConverter {
    fun convert(orderDbo: OrderDbo): Order = Order.of(
        orderId = orderDbo.orderId,
        zoneId = orderDbo.zoneId.toString(),
        tagerId = orderDbo.taagerId,
        countryIso = orderDbo.country,
        orderLines = orderDbo.orderLine.map {
            OrderLine(
                productId = ProductId(value = it.productId) ,
                price = Price(value = it.price),
                quantity = Quantity(value = it.quantity)
            )
        },
        placedAt = Moment.fromTimeStamp(orderDbo.placedAt.time),
        confirmedAt = Moment.fromTimeStamp(orderDbo.confirmedAt.time),
        cashOnDelivery = orderDbo.cashOnDelivery,
        status =  convertStatus(orderDbo.status),
        priorityId = orderDbo.priorityId.let { it?.toString() },
        companyId = orderDbo.companyId.let { it?.toString() },
        allocatedAt = orderDbo.allocatedAt?.let { Moment.fromTimeStamp(it.time) },
        shippedOutAt = orderDbo.shippedOutAt?.let { it1 -> Moment.fromTimeStamp(it1.time) },
    )
    private fun convertStatus(dbStatus: AllocationOrderStatus) = when(dbStatus) {
       AllocationOrderStatus.CONFIRMED -> OrderStatus.CONFIRMED
       AllocationOrderStatus.ALLOCATED -> OrderStatus.ALLOCATED
       AllocationOrderStatus.SHIPPED_OUT -> OrderStatus.SHIPPED_OUT
       AllocationOrderStatus.CANCELED -> OrderStatus.CANCELED
    }
}