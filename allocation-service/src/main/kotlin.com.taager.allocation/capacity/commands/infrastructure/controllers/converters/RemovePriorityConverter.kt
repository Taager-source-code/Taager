package com.taager.allocation.capacity.commands.infrastructure.controllers.converters
import com.taager.allocation.capacity.commands.application.models.RemoveProvincePriorityRequest
import com.taager.allocation.capacity.commands.application.models.RemoveZonePriorityRequest
import org.springframework.stereotype.Component
@Component
class RemovePriorityConverter {
    fun convert(
        provinceId: String,
        priorityId: String
    ): RemoveProvincePriorityRequest {
        return RemoveProvincePriorityRequest(
            provinceId = provinceId,
            provincePriorityId = priorityId
        )
    }
    fun convert(
        provinceId: String,
        zoneId: String,
        priorityId: String
    ): RemoveZonePriorityRequest {
        return RemoveZonePriorityRequest(
            provinceId = provinceId,
            zoneId = zoneId,
            zonePriorityId = priorityId
        )
    }
}