package com.taager.allocation.allocator.commands.domain.events
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.sharedkernel.domain.models.Moment
import com.taager.allocation.sharedkernel.domain.models.base.DomainEvent
import com.taager.allocation.sharedkernel.domain.models.valueobjects.CompanyId
interface OrderEvent : DomainEvent
data class OrderAllocated(val orderId: OrderId, val companyId: CompanyId, val updatedAt: Moment) : OrderEvent
data class OrderUnAllocated(val orderId: OrderId, val updatedAt: Moment) : OrderEvent