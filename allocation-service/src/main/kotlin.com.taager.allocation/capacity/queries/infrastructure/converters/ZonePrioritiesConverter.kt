package com.taager.allocation.capacity.queries.infrastructure.converters
import com.taager.allocation.capacity.queries.application.models.ZonePriorityResponse
import com.taager.allocation.openapi.model.ZonePriorityDTO
import org.springframework.stereotype.Component
@Component
class ZonePrioritiesConverter {
    fun convert(zonePriority: ZonePriorityResponse): ZonePriorityDTO {
        return ZonePriorityDTO(
            zonePriorityId = zonePriority.zonePriorityId,
            companyName = zonePriority.companyName,
            capacity = zonePriority.capacity,
            capacityMode = zonePriority.capacityMode,
            remainingCapacity = zonePriority.remainingCapacity,
            inTesting = zonePriority.inTesting
        )
    }
}
