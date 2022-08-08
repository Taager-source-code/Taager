package com.taager.allocation.allocator.commands.infrastructure.controllers.converters
import com.taager.allocation.allocator.commands.domain.application.models.UpdateAllocationStatusRequest
import com.taager.allocation.allocator.commands.domain.application.models.valueobjects.AllocationStatus
import com.taager.allocation.openapi.model.AllocatorStatusDTO
import org.springframework.stereotype.Component
@Component
class UpdateAllocationConfigConverter {
    fun convert(
        updateAllocationStatusDTO: AllocatorStatusDTO
    ): UpdateAllocationStatusRequest {
        return UpdateAllocationStatusRequest(
            status =  AllocationStatus.of(updateAllocationStatusDTO.status.value.uppercase()) ,
        )
    }
}