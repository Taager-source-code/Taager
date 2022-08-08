package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.OrderConfirmedEvent
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.contracts.ZoneRepo
import com.taager.allocation.allocator.commands.domain.exceptions.ZoneInProvinceNotFoundException
import com.taager.allocation.allocator.commands.domain.models.Order
import com.taager.allocation.sharedkernel.application.EventHandler
import org.springframework.stereotype.Service
@Service
class OrderConfirmedHandler(
    private val orderRepo: OrderRepo,
    private val zoneRepo: ZoneRepo
) : EventHandler<OrderConfirmedEvent, Unit>() {
    override fun handle(event: OrderConfirmedEvent) {
        logger.debug("Creating new confirmed order in DB with orderId [${event.orderId}]")
        if (event.countryIso.value != "EGY")
            return
        val zoneId = zoneRepo.findZoneIdByZoneAndProvince(event.provinceName, event.zoneName)
            ?: throw  ZoneInProvinceNotFoundException(event.provinceName, event.zoneName)
        val order = Order.newConfirmedOrder(
            orderId = event.orderId.value,
            zoneId = zoneId.value.toString(),
            tagerId = event.taagerId.value,
            countryIso = event.countryIso.value,
            orderLines = event.orderLines,
            placedAt = event.placedAt.value,
            confirmedAt = event.confirmedAt.value,
            cashOnDelivery = event.cashOnDelivery.value
        )
        orderRepo.save(order)
    }
}