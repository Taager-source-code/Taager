package com.taager.allocation.allocator.commands.domain.contracts
import com.taager.allocation.allocator.commands.domain.models.CountryIso
import com.taager.allocation.allocator.commands.domain.models.Order
import com.taager.allocation.allocator.commands.domain.models.OrderId
import java.util.*
interface OrderRepo {
    fun getConfirmedOrders(countryIso: CountryIso): List<Order>
    fun getById(orderId: OrderId): Optional<Order>
    fun getByIds(orderIds: List<OrderId>): List<Order>
    fun save(order: Order)
    fun saveAll(orders: List<Order>)
    fun delete(order: Order)
}