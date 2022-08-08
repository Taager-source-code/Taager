package com.taager.allocation.allocator.commands.infrastructure.repositories.interfaces
import java.sql.Timestamp
interface AllocationConfigDbResult {
    fun getId(): String
    fun getStatus(): String
    fun getLastRun(): Timestamp
}