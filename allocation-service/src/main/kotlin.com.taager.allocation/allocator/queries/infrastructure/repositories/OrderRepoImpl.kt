package com.taager.allocation.allocator.queries.infrastructure.repositories
import com.taager.allocation.allocator.common.infrastructure.db.access.OrderDao
import com.taager.allocation.allocator.queries.application.contracts.OrderRepo
import com.taager.allocation.allocator.queries.application.models.GetOrderCountRequest
import org.springframework.stereotype.Service
@Service("OrderQueryRepoImpl")
class OrderRepoImpl(private val orderDao: OrderDao): OrderRepo {
    override fun getOrderCount(request: GetOrderCountRequest): Int {
        val orderCount = orderDao.findOrderCount(
            request.status.toString(),
            request.fromDate.value.toString(),
            request.toDate.value.toString()
        )
        return orderCount.getOrderCount()
    }
}