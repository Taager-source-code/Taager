package com.taager.allocation.allocator.commands.infrastructure.repositories.converters
import com.taager.allocation.allocator.commands.domain.models.ShippingCompanyPriority
import com.taager.allocation.allocator.commands.domain.models.Zone
import com.taager.allocation.allocator.common.infrastructure.db.interfaces.ZoneCapacityDbResult
import com.taager.allocation.capacity.commands.infrastructure.db.models.ZoneDbo
import com.taager.allocation.capacity.commands.infrastructure.db.models.ZoneShippingCompanyPriorityDbo
import com.taager.allocation.sharedkernel.domain.models.valueobjects.*
import org.springframework.stereotype.Component
@Component
class ZoneToDomainConverter {
    fun convert(zoneCapacitiesDbo: List<ZoneCapacityDbResult>, zonesDbo: List<ZoneDbo>): List<Zone> {
        val zonesPriorityMap = zoneCapacitiesDbo.associateBy { ZonePriority(it.getZoneId(),it.getPriorityId()) }
        val zones = zonesDbo.map { zoneDbo ->
            Zone.of(
                zoneId = zoneDbo.id.toString(),
                name = zoneDbo.name,
                zonePriorities = zoneDbo.zoneShippingCompanyPriorities.map {zonePriority->
                    val remainingCap = zonesPriorityMap.getRemainingCapacityFor(zoneDbo, zonePriority) ?: zonePriority.capacity
                    ShippingCompanyPriority.of(
                        priorityId = PriorityId(zonePriority.priorityId),
                        companyId = CompanyId(zonePriority.companyId),
                        capacity = Capacity.of(remainingCap),
                        capacityMode = CapacityMode.of(zonePriority.capacityMode),
                        cutOffTime = CutOffTime.of(zonePriority.cutOffTime),
                    )
                },
            )
        }
        return zones
    }
    private fun Map<ZonePriority,ZoneCapacityDbResult>.getRemainingCapacityFor(
        zoneDbo: ZoneDbo,
        it: ZoneShippingCompanyPriorityDbo
    ) = this[ZonePriority(zoneDbo.id.toString(), it.priorityId.toString())]?.getRemainingCapacity()
}
data class ZonePriority(val zoneId: String, val priorityId: String)