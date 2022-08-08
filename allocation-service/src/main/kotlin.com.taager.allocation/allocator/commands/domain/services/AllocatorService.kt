package com.taager.allocation.allocator.commands.domain.services
import com.taager.allocation.allocator.commands.domain.models.Order
import com.taager.allocation.allocator.commands.domain.models.ShippingCompanyPriority
import com.taager.allocation.allocator.commands.domain.models.Zone
import com.taager.allocation.capacity.commands.domain.exceptions.ZoneNotFoundException
import org.springframework.stereotype.Service
data class AllocationResult(val allocatedOrders: List<Order>, val notAllocatedOrders: List<Order>)
@Service
class AllocatorService {
    fun allocate(confirmedOrders: List<Order>, zones: List<Zone>): AllocationResult {
        val allocatedOrders: MutableList<Order> = mutableListOf()
        val noCapOrders: MutableList<Order> = mutableListOf()
        val zonesMap = zones.associateBy { it.zoneId }
        confirmedOrders.forEach { order ->
            val zone = zonesMap[order.zoneId] ?: throw ZoneNotFoundException(order.zoneId)
            val nextPriority = zone.getNextPriority()
            if (nextPriority == null) {
                noCapOrders.add(order)
                return@forEach
            }
            order.allocateTo(nextPriority)
            depletePriority(nextPriority, zones)
            allocatedOrders.add(order)
        }
        return AllocationResult(allocatedOrders = allocatedOrders, notAllocatedOrders = noCapOrders)
    }
    private fun depletePriority(nextPriority: ShippingCompanyPriority, zones: List<Zone>) =
        if (nextPriority.capacityMode.isProvinceLevel())
            depletePriorityInAllZones(zones, nextPriority)
        else
            nextPriority.deplete()
    private fun depletePriorityInAllZones(zones: List<Zone>, nextPriority: ShippingCompanyPriority) =
        zones.forEach { it.depletePriorityIfFound(nextPriority.priorityId) }
}