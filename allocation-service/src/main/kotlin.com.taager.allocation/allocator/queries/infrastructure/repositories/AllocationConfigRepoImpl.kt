package com.taager.allocation.allocator.queries.infrastructure.repositories
import com.taager.allocation.allocator.common.infrastructure.db.access.AllocationConfigDao
import com.taager.allocation.allocator.common.infrastructure.db.enums.AllocationConfigStatus
import com.taager.allocation.allocator.queries.application.contracts.AllocationConfigRepo
import com.taager.allocation.allocator.queries.application.models.AllocatorStatus
import org.springframework.stereotype.Service
@Service("AllocationConfigQueryRepoImpl")
class AllocationConfigRepoImpl(private val allocationConfigDao: AllocationConfigDao) : AllocationConfigRepo {
    override fun getAllocatorStatus(): AllocatorStatus {
        val retrievedAllocationConfigEntity = allocationConfigDao.findAll()
        return when (retrievedAllocationConfigEntity[0].status) {
            AllocationConfigStatus.ENABLED -> AllocatorStatus.ENABLED
            AllocationConfigStatus.DISABLED -> AllocatorStatus.DISABLED
        }
    }
}