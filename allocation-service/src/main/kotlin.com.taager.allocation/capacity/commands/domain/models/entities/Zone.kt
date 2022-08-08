package com.taager.allocation.capacity.commands.domain.models.entities
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ProvinceId
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ShippingCompaniesPriorities
import com.taager.allocation.sharedkernel.domain.models.base.Entity
import com.taager.allocation.sharedkernel.domain.models.valueobjects.*
class Zone private constructor(
    val zoneId: ZoneId,
    val name: ZoneName,
    val provinceId: ProvinceId,
    manuallyModified: Boolean,
    private val zonePriorities: ShippingCompaniesPriorities,
) : Entity<ZoneId>(zoneId) {
    var manuallyModified: Boolean = manuallyModified
        private set
    companion object {
        fun of(
            zoneId: String,
            name: String,
            provinceId: String,
            manuallyModified: Boolean,
            zonePriorities: ShippingCompaniesPriorities
        ): Zone = Zone(
            zoneId = ZoneId.of(zoneId),
            name = ZoneName(name),
            provinceId = ProvinceId.of(provinceId),
            manuallyModified = manuallyModified,
            zonePriorities = zonePriorities
        )
    }
    fun addPriority(priority: ShippingCompanyPriority) = zonePriorities.addPriority(priority.clone())
    fun markModifiedManually() {
        manuallyModified = true
    }
    fun markModifiedAutomatically() {
        manuallyModified = false
    }
    fun reset(desiredPriorities: List<PriorityId>) {
        zonePriorities.reset(desiredPriorities)
        markModifiedAutomatically()
    }
    fun removePriorityIfFound(priorityId: PriorityId) {
        val zonePriority = zonePriorities.findPriority(priorityId) ?: return
        zonePriorities.removePriority(zonePriority)
    }
    fun removePriorityOrThrowIfNotFound(priorityId: PriorityId) {
        val zonePriority = zonePriorities.getPriorityOrThrowIfNotFound(priorityId)
        zonePriorities.removePriority(zonePriority)
    }
    fun reSortPriorities(priorityIds: List<PriorityId>) {
        zonePriorities.reSortPriorities(priorityIds)
        markModifiedManually()
    }
    fun updatePriorityCapacityIfFound(priorityId: PriorityId, capacity: Capacity) {
        zonePriorities.findPriority(priorityId)?.updateCapacity(capacity)
    }
    fun updateCutOffTimeIfFound(priorityId: PriorityId, cutOffTime: CutOffTime) {
        zonePriorities.findPriority(priorityId)?.updateCutOffTime(cutOffTime)
    }
    fun updateCapacity(priorityId: PriorityId, capacity: Capacity) {
        zonePriorities.getPriorityOrThrowIfNotFound(priorityId).updateCapacity(capacity)
    }
    fun updateTestingStatus(priorityId: PriorityId, testingStatus: Boolean) {
        zonePriorities.getPriorityOrThrowIfNotFound(priorityId).updateTestingStatus(testingStatus)
    }
    fun findPriority(priorityId: PriorityId) = zonePriorities.findPriority(priorityId)
    fun getPriorities(): List<ShippingCompanyPriority> = zonePriorities.getPriorities()
}