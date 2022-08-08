package com.taager.allocation.capacity.commands.infrastructure.controllers.converters
import com.taager.allocation.capacity.commands.application.models.PrioritiesId
import com.taager.allocation.capacity.commands.application.models.ReSortProvincePrioritiesRequest
import com.taager.allocation.capacity.commands.application.models.ReSortZonePrioritiesRequest
import com.taager.allocation.openapi.model.PrioritiesIdsDTO
import com.taager.allocation.openapi.model.ReSortProvincePrioritiesDTO
import org.springframework.stereotype.Component
@Component
class ResortPriorityConverter {
    fun convert(
        provinceId: String,
        reSortProvincePrioritiesDTO: ReSortProvincePrioritiesDTO
    ): ReSortProvincePrioritiesRequest {
        return ReSortProvincePrioritiesRequest(
            provinceId = provinceId,
            resetZones = reSortProvincePrioritiesDTO.resetZones,
            priorities = reSortProvincePrioritiesDTO.priorities.map { convert(it) },
        )
    }
    fun convert(
        provinceId: String,
        zoneId: String,
        prioritiesIdsDTO: List<PrioritiesIdsDTO>
    ): ReSortZonePrioritiesRequest {
        return ReSortZonePrioritiesRequest(
            provinceId = provinceId,
            zoneId = zoneId,
            prioritiesIds = prioritiesIdsDTO.map { convert(it) },
        )
    }
    fun convert(prioritiesIdsDTO: PrioritiesIdsDTO): PrioritiesId {
        return PrioritiesId(prioritiesIdsDTO.priorityId)
    }
}
