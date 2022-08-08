package com.taager.allocation.allocator.common.infrastructure.db.access
import com.taager.allocation.allocator.commands.infrastructure.repositories.interfaces.AllocationConfigDbResult
import com.taager.allocation.allocator.common.infrastructure.db.models.AllocationConfigDbo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*
@Repository
interface AllocationConfigDao : JpaRepository<AllocationConfigDbo, UUID> {
    @Query(
        value = """
            SELECT CAST(id as VARCHAR),
            allocation_config.status as status,
            allocation_config.last_run as lastRun
            FROM allocation_config 
            LIMIT 1""",
        nativeQuery = true
    )
    fun findAllocationConfig(): AllocationConfigDbResult?
}