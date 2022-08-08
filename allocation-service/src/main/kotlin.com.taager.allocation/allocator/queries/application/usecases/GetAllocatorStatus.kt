package com.taager.allocation.allocator.queries.application.usecases
import com.taager.allocation.allocator.queries.application.contracts.AllocationConfigRepo
import com.taager.allocation.allocator.queries.application.models.GetAllocatorResponse
import com.taager.allocation.sharedkernel.application.UseCaseWithoutRequest
import org.springframework.stereotype.Service
@Service
class GetAllocatorStatus(val allocatorConfigRepo: AllocationConfigRepo) :
    UseCaseWithoutRequest<GetAllocatorResponse>() {
    override fun execute(): GetAllocatorResponse {
        logger.debug("Get Allocator status")
        val status = allocatorConfigRepo.getAllocatorStatus()
        return GetAllocatorResponse(status = status)
    }
}