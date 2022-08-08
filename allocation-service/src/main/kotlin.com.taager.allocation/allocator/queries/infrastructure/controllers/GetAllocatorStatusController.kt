package com.taager.allocation.allocator.queries.infrastructure.controllers
import com.taager.allocation.allocator.queries.application.models.AllocatorStatus
import com.taager.allocation.allocator.queries.application.models.GetAllocatorResponse
import com.taager.allocation.allocator.queries.application.usecases.GetAllocatorStatus
import com.taager.allocation.openapi.api.GetAllocatorStatusApi
import com.taager.allocation.openapi.model.AllocatorStatusDTO
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
@RestController
class GetAllocatorStatusController(private val getAllocatorStatus: GetAllocatorStatus) : GetAllocatorStatusApi {
    override fun getAllocatorStatus(): ResponseEntity<AllocatorStatusDTO> {
        val result = getAllocatorStatus.execute()
        return ResponseEntity(toDto(result), HttpStatus.OK)
    }
    private fun toDto(result: GetAllocatorResponse) =
        AllocatorStatusDTO(
            when (result.status) {
                AllocatorStatus.ENABLED -> AllocatorStatusDTO.Status.enabled
                AllocatorStatus.DISABLED -> AllocatorStatusDTO.Status.disabled
            }
        )
}