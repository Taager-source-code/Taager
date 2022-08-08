package com.taager.allocation.allocator.queries.application.usecases
import com.taager.allocation.allocator.queries.application.contracts.OrderRepo
import com.taager.allocation.allocator.queries.application.models.GetOrderCountRequest
import com.taager.allocation.allocator.queries.application.models.GetOrderCountResponse
import com.taager.allocation.sharedkernel.application.UseCase
import org.springframework.stereotype.Service
@Service
class GetOrderCount(val orderRepo: OrderRepo) : UseCase<GetOrderCountRequest, GetOrderCountResponse>() {
    override fun execute(request: GetOrderCountRequest): GetOrderCountResponse {
        logger.debug("Calculating order count for status: [${request.status}] between time range [${request.fromDate}] --  [${request.toDate}]")
        val orderCount = orderRepo.getOrderCount(request)
        return GetOrderCountResponse(count = orderCount)
    }
}