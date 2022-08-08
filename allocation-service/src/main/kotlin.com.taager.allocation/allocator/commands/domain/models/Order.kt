package com.taager.allocation.allocator.commands.domain.models
import com.taager.allocation.allocator.commands.domain.events.OrderAllocated
import com.taager.allocation.allocator.commands.domain.events.OrderUnAllocated
import com.taager.allocation.capacity.commands.domain.exceptions.OrderCanNotBeAllocatedException
import com.taager.allocation.sharedkernel.domain.models.Moment
import com.taager.allocation.sharedkernel.domain.models.base.AggregateRoot
import com.taager.allocation.sharedkernel.domain.models.base.ValueObject
import com.taager.allocation.sharedkernel.domain.models.valueobjects.CompanyId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.PriorityId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneId
class Order private constructor(
    val orderId: OrderId,
    val zoneId: ZoneId,
    val tagerId: TagerId,
    val countryIso: CountryIso,
    val placedAt: PlacedAt,
    val confirmedAt: ConfirmedAt,
    val cashOnDelivery: CashOnDelivery,
    val orderLines: List<OrderLine>,
    priorityId: PriorityId? = null,
    companyId: CompanyId? = null,
    allocatedAt: AllocatedAt? = null,
    shippedOutAt: ShippedOutAt? = null,
    status: OrderStatus,
) : AggregateRoot<OrderId>(orderId) {
    var priorityId: PriorityId? = priorityId
        private set
    var companyId: CompanyId? = companyId
        private set
    var allocatedAt: AllocatedAt? = allocatedAt
        private set
    var shippedOutAt: ShippedOutAt? = shippedOutAt
        private set
    var status: OrderStatus = status
        private set
    companion object {
        fun newConfirmedOrder(
            orderId: String,
            zoneId: String,
            tagerId: Int,
            countryIso: String,
            orderLines: List<OrderLine>,
            placedAt: Moment,
            confirmedAt: Moment,
            cashOnDelivery: Int
        ) = of(
            orderId = orderId,
            zoneId = zoneId,
            tagerId = tagerId,
            countryIso = countryIso,
            orderLines = orderLines,
            placedAt = placedAt,
            confirmedAt = confirmedAt,
            cashOnDelivery = cashOnDelivery,
            status = OrderStatus.CONFIRMED
        )
        fun of(
            orderId: String,
            zoneId: String,
            tagerId: Int,
            countryIso: String,
            orderLines: List<OrderLine>,
            placedAt: Moment,
            confirmedAt: Moment,
            cashOnDelivery: Int,
            status: OrderStatus,
            priorityId: String? = null,
            companyId: String? = null,
            allocatedAt: Moment? = null,
            shippedOutAt: Moment? = null,
        ): Order = Order(
            orderId = OrderId(orderId),
            zoneId = ZoneId.of(zoneId),
            tagerId = TagerId(tagerId),
            countryIso = CountryIso(countryIso),
            orderLines = orderLines,
            placedAt = PlacedAt(placedAt),
            confirmedAt = ConfirmedAt(confirmedAt),
            cashOnDelivery = CashOnDelivery(cashOnDelivery),
            priorityId = priorityId?.let { PriorityId.of(priorityId) },
            companyId = companyId?.let { CompanyId.of(companyId) },
            allocatedAt = allocatedAt?.let { AllocatedAt(allocatedAt) },
            shippedOutAt = shippedOutAt?.let { ShippedOutAt(shippedOutAt) },
            status = status
        )
    }
    fun allocateTo(priority: ShippingCompanyPriority) {
        if (status != OrderStatus.CONFIRMED) throw OrderCanNotBeAllocatedException(orderId, status)
        priorityId = priority.priorityId
        companyId = priority.companyId
        status = OrderStatus.ALLOCATED
        allocatedAt = AllocatedAt(Moment.now())
        raiseEvent(OrderAllocated(orderId, priority.companyId, Moment.now()))
    }
    fun onWarehouseCanceled() {
        status = OrderStatus.CANCELED
        clearAllocation()
    }
    fun onShipmentShippedOut(date: Moment) {
        status = OrderStatus.SHIPPED_OUT
        shippedOutAt = ShippedOutAt(date)
    }
    fun onShipmentFailedToCreate() {
        backToConfirmed()
    }
    fun onShipmentDeleted() {
        backToConfirmed()
    }
    fun unAllocate() {
        backToConfirmed()
        raiseEvent(OrderUnAllocated(this.orderId, Moment.now()))
    }
    private fun backToConfirmed() {
        status = OrderStatus.CONFIRMED
        clearAllocation()
    }
    private fun clearAllocation() {
        priorityId = null
        companyId = null
        allocatedAt = null
        shippedOutAt = null
    }
}
data class TagerId(val value: Int) : ValueObject
data class OrderId(val value: String) : ValueObject
data class CountryIso(val value: String) : ValueObject
data class ConfirmedAt(val value: Moment) : ValueObject
data class ShippedOutAt(val value: Moment) : ValueObject
data class PlacedAt(val value: Moment) : ValueObject
data class AllocatedAt(val value: Moment) : ValueObject
data class ProductId(val value: String) : ValueObject
data class Price(val value: Int) : ValueObject
data class CashOnDelivery(val value: Int) : ValueObject
data class Quantity(val value: Int) : ValueObject
data class OrderLine(val productId: ProductId, val price: Price, val quantity: Quantity) : ValueObject
enum class OrderStatus(val value: String) {
    CONFIRMED("CONFIRMED"),
    ALLOCATED("ALLOCATED"),
    SHIPPED_OUT("SHIPPED_OUT"),
    CANCELED("CANCELED")
}