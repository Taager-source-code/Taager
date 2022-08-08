package com.taager.allocation.allocator.commands.infrastructure.repositories
import com.taager.allocation.allocator.commands.domain.application.models.valueobjects.AllocationStatus
import com.taager.allocation.allocator.commands.domain.contracts.AllocationConfigRepo
import com.taager.allocation.allocator.commands.domain.exceptions.AllocatorConfigNotFoundException
import com.taager.allocation.allocator.commands.infrastructure.repositories.interfaces.AllocationConfigDbResult
import com.taager.allocation.allocator.common.infrastructure.db.access.AllocationConfigDao
import com.taager.allocation.allocator.common.infrastructure.db.enums.AllocationConfigStatus
import com.taager.allocation.allocator.common.infrastructure.db.models.AllocationConfigDbo
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.sql.Timestamp
import java.time.Instant
import java.util.*
@Service
class AllocationConfigRepoImpl(private val allocationConfigDao: AllocationConfigDao) : AllocationConfigRepo {
    @Transactional
    override fun updateAllocationStatus(status: AllocationStatus) {
        val retrievedAllocationConfigEntity: AllocationConfigDbResult = allocationConfigDao.findAllocationConfig()
            ?: throw AllocatorConfigNotFoundException("Allocator config doesn't exist")
        val updatedAllocationConfig = AllocationConfigDbo(
            id = UUID.fromString(retrievedAllocationConfigEntity.getId()),
            status = AllocationConfigStatus.valueOf(status.value),
            lastRun = retrievedAllocationConfigEntity.getLastRun()
        )
        allocationConfigDao.save(updatedAllocationConfig)
    }
    @Transactional
    override fun updateAllocationRunTime() {
        val retrievedAllocationConfigEntity = allocationConfigDao.findAll()
        val updatedAllocationConfig = AllocationConfigDbo(
            id = retrievedAllocationConfigEntity[0].id,
            status = retrievedAllocationConfigEntity[0].status,
            lastRun = Timestamp(Instant.now().toEpochMilli())
        )
        allocationConfigDao.save(updatedAllocationConfig)
    }
    override fun allocatorIsEnabled(): Boolean {
        val config = allocationConfigDao.findAllocationConfig() ?: return true
        return when (config.getStatus()) {
            AllocationConfigStatus.ENABLED.toString() -> true
            else -> false
        }
    }
}