package com.taager.allocation.capacity.commands.domain.models.valueobjects
import com.taager.allocation.capacity.commands.domain.exceptions.DesiredOrderMissingSomePrioritiesException
import com.taager.allocation.capacity.commands.domain.exceptions.PriorityAlreadyFoundException
import com.taager.allocation.capacity.commands.domain.exceptions.PriorityNotFoundException
import com.taager.allocation.capacity.commands.domain.models.entities.ShippingCompanyPriority
import com.taager.allocation.sharedkernel.domain.models.valueobjects.*
import java.util.*
data class ShippingCompaniesPriorities(private val priorities: MutableList<ShippingCompanyPriority>) {
    fun addPriority(
        companyId: CompanyId,
        capacity: Capacity,
        inTesting: Boolean,
        capacityMode: CapacityMode,
        remainingCapacity: Capacity,
        cutOfTime: CutOffTime
    ): ShippingCompanyPriority {
        val priority = ShippingCompanyPriority.new(
            capacity = capacity,
            remainingCapacity = remainingCapacity,
            companyId = companyId,
            inTesting = inTesting,
            capacityMode = capacityMode,
            cutOfTime = cutOfTime,
        )
        priorities.add(priority)
        return priority
    }
    fun addPriority(priority: ShippingCompanyPriority) {
        if(priorities.contains(priority))
            throw PriorityAlreadyFoundException(priority.id)
        priorities.add(priority)
    }
    fun removePriority(priority: ShippingCompanyPriority) {
        priorities.remove(priority)
    }
    fun reSortPriorities(desiredOrder: List<PriorityId>) {
        assertDesiredOrderContainsAllPriorities(desiredOrder)
        val sortedPriorities = desiredOrder.map { getPriorityOrThrowIfNotFound(it) }
        priorities.clear()
        priorities.addAll(sortedPriorities)
    }
    fun reset(desiredPriorities: List<PriorityId>) {
        val filteredPriorities = desiredPriorities.mapNotNull { findPriority(it) }
        priorities.clear()
        priorities.addAll(filteredPriorities)
    }
    fun findPriority(priorityId: PriorityId): ShippingCompanyPriority? = priorities.find { it.priorityId == priorityId }
    fun getPriorityOrThrowIfNotFound(priorityId: PriorityId) =
        priorities.find { it.priorityId == priorityId }
            ?: throw PriorityNotFoundException(priorityId)
    private fun assertDesiredOrderContainsAllPriorities(desiredOrder: List<PriorityId>) {
        if (desiredOrder.size != priorities.size)
            throw DesiredOrderMissingSomePrioritiesException(priorities.size, desiredOrder.size)
    }
    fun getPriorities(): List<ShippingCompanyPriority> = Collections.unmodifiableList(priorities)
}