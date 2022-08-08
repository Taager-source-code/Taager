package com.taager.allocation.allocator.queries.application.contracts
import com.taager.allocation.allocator.queries.application.models.GetOrderCountRequest
interface OrderRepo {
    fun getOrderCount(request: GetOrderCountRequest): Int
}