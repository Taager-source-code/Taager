package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.domain.application.models.UpdateAllocationStatusRequest
import com.taager.allocation.allocator.commands.domain.contracts.AllocationConfigRepo
import com.taager.allocation.sharedkernel.application.UseCase
import org.springframework.stereotype.Service
@Service
class UpdateAllocationStatus(val allocationConfigRepo: AllocationConfigRepo) : UseCase<UpdateAllocationStatusRequest, Unit>() {
    override fun execute(request: UpdateAllocationStatusRequest) {
        logger.debug("Update allocation status to be [${request.status}]")
        allocationConfigRepo.updateAllocationStatus(request.status)
    }
}
