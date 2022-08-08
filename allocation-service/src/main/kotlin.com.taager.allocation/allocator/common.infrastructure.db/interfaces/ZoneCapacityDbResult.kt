package com.taager.allocation.allocator.common.infrastructure.db.interfaces
interface ZoneCapacityDbResult {
    fun getZoneId(): String
    fun getPriorityId(): String
    fun getCapacity(): Int
    fun getRemainingCapacity(): Int
}