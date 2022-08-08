package com.taager.allocation.capacity.common.db.interfaces
interface ZoneRemainingCapacityDbResult {
    fun getZoneId(): String
    fun getPriorityId(): String
    fun getRemainingCapacity(): Int
}