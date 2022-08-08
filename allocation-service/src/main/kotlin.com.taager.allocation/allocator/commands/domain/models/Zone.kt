package com.taager.allocation.allocator.commands.domain.models
import com.taager.allocation.sharedkernel.domain.models.base.AggregateRoot
import com.taager.allocation.sharedkernel.domain.models.valueobjects.PriorityId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneName
import java.util.*
class Zone private constructor(
    val zoneId: ZoneId,
    val name: ZoneName,
    private val zonePriorities: List<ShippingCompanyPriority>,
) : AggregateRoot<ZoneId>(zoneId) {
    companion object {
        fun of(
            zoneId: String,
            name: String,
            zonePriorities: List<ShippingCompanyPriority>
        ): Zone = Zone(
            zoneId = ZoneId.of(zoneId),
            name = ZoneName(name),
            zonePriorities = zonePriorities
        )
    }
    fun getNextPriority(): ShippingCompanyPriority? {
        return zonePriorities.firstOrNull { it.hasCapacity() }
    }
    fun depletePriorityIfFound(priorityId: PriorityId) =
        zonePriorities.find { it.priorityId == priorityId }?.deplete()
    fun getPriorities(): List<ShippingCompanyPriority> = Collections.unmodifiableList(zonePriorities)
}