package com.taager.allocation.allocator.commands.infrastructure.repositories
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.events.OrderEvent
import com.taager.allocation.allocator.commands.domain.models.CountryIso
import com.taager.allocation.allocator.commands.domain.models.Order
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.infrastructure.publishers.pulsar.OrderStatusChangedPublisher
import com.taager.allocation.allocator.commands.infrastructure.repositories.converters.OrderToDomainConverter
import com.taager.allocation.allocator.common.infrastructure.db.access.OrderDao
import com.taager.allocation.allocator.common.infrastructure.db.converters.OrderToDbConverter
import com.taager.allocation.allocator.common.infrastructure.db.enums.AllocationOrderStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
@Service
class OrderRepoImpl(
    private val orderDao: OrderDao,
    private val toDomainConverter: OrderToDomainConverter,
    private val toDbConverter: OrderToDbConverter,
    private val orderStatusChangedPublisher: OrderStatusChangedPublisher,
) : OrderRepo {
    override fun getConfirmedOrders(countryIso: CountryIso): List<Order> =
        orderDao.findByStatusAndCountry(AllocationOrderStatus.CONFIRMED, countryIso.value)
            .map { toDomainConverter.convert(it) }
    @Transactional(readOnly = true)
    override fun getById(orderId: OrderId): Optional<Order> {
        val orderDbo = orderDao.findById(orderId.value)
        return orderDbo.map { toDomainConverter.convert(it) }
    }
    @Transactional(readOnly = true)
    override fun getByIds(orderIds: List<OrderId>): List<Order> {
        val ordersDbo = orderDao.findByOrderIdIn(orderIds.map { it.value })
        return ordersDbo.map { toDomainConverter.convert(it) }
    }
    override fun save(order: Order) {
        val orderDbo = toDbConverter.convert(order)
        orderDao.save(orderDbo)
    }
    override fun saveAll(orders: List<Order>) {
        val orderDboList = orders.map { toDbConverter.convert(it) }
        orderDao.saveAll(orderDboList)
        orders.map { order -> order.occurredEvents().forEach { orderStatusChangedPublisher.publish(it as OrderEvent) } }
    }
    override fun delete(order: Order) {
        orderDao.delete(toDbConverter.convert(order))
    }
}