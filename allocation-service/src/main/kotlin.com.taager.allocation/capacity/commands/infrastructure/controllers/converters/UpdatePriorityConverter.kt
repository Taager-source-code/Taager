package com.taager.allocation.capacity.commands.infrastructure.controllers.converters
import com.taager.allocation.capacity.commands.application.models.UpdateProvincePriorityRequest
import com.taager.allocation.capacity.commands.application.models.UpdateZonePriorityRequest
import com.taager.allocation.openapi.model.UpdateProvincePriorityDTO
import com.taager.allocation.openapi.model.UpdateZonePriorityDTO
import org.springframework.stereotype.Component
@Component
class UpdatePriorityConverter {
    fun convert(
        provinceId: String,
        priorityId: String,
        updateProvincePriorityDTO: UpdateProvincePriorityDTO
    ): UpdateProvincePriorityRequest {
        return UpdateProvincePriorityRequest(
            provinceId =  provinceId,
            priorityId =  priorityId,
            capacityMode =  updateProvincePriorityDTO.capacityMode.value,
            capacity =  updateProvincePriorityDTO.capacity,
            cutOffTime =  updateProvincePriorityDTO.cutOffTime
        )
    }
    fun convert(
        provinceId: String,
        zoneId: String,
        priorityId: String,
        updateZonePriorityDTO: UpdateZonePriorityDTO
    ): UpdateZonePriorityRequest {
        return UpdateZonePriorityRequest(
            provinceId = provinceId,
            zoneId = zoneId,
            priorityId = priorityId,
            capacity = updateZonePriorityDTO.capacity,
            inTesting = updateZonePriorityDTO.inTesting
        )
    }
}