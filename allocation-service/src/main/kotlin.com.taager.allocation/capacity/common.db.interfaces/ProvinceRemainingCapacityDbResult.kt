package com.taager.allocation.capacity.common.db.interfaces
interface ProvinceRemainingCapacityDbResult {
    fun getProvinceId(): String
    fun getPriorityId(): String
    fun getRemainingCapacity(): Int
}