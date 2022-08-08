package com.taager.allocation.capacity.queries.infrastructure.converters
import com.taager.allocation.capacity.queries.application.models.ProvincePriorityResponse
import com.taager.allocation.openapi.model.ProvincePriorityDTO
import org.springframework.stereotype.Component
@Component
class ProvincePrioritiesConverter {
    fun convert(provincePriority: ProvincePriorityResponse): ProvincePriorityDTO {
        return ProvincePriorityDTO(
            provincePriorityId = provincePriority.provincePriorityId,
            companyName = provincePriority.companyName,
            capacity = provincePriority.capacity,
            capacityMode = provincePriority.capacityMode,
            remainingCapacity = provincePriority.remainingCapacity,
            cutOffTime = provincePriority.cutOffTime
        )
    }
}
