package com.taager.allocation.allocator.queries.infrastructure.controllers.converters
import com.taager.allocation.allocator.commands.domain.models.OrderStatus
import com.taager.allocation.allocator.queries.application.models.GetOrderCountRequest
import com.taager.allocation.sharedkernel.domain.models.valueobjects.FilterDate
import org.springframework.stereotype.Component
@Component
class GetOrderCountConverter {
    fun convert(
        status: String,
        fromDate: String?,
        toDate: String?,
    ): GetOrderCountRequest {
        return GetOrderCountRequest(
            status = OrderStatus.valueOf(status.uppercase()),
            fromDate = if (fromDate != null) FilterDate.of(fromDate) else FilterDate.now(),
            toDate =  if (toDate != null) FilterDate.of(toDate) else FilterDate.now()
        )
    }
}