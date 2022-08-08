package com.taager.allocation.capacity.queries.infrastructure.db.interfaces
interface ProvincePriorityDbResult {
    fun getPriorityId(): String
    fun getCutOffTime(): String
    fun getCapacity(): Int
    fun getCapacityMode(): String
    fun getCompanyName(): String
}
