package com.taager.allocation.allocator.commands.domain.models
import com.taager.allocation.capacity.commands.domain.exceptions.PriorityHasNoCapacityException
import com.taager.allocation.sharedkernel.domain.models.base.Entity
import com.taager.allocation.sharedkernel.domain.models.valueobjects.*
class ShippingCompanyPriority private constructor(
    val priorityId: PriorityId,
    val companyId: CompanyId,
    capacity: Capacity,
    capacityMode: CapacityMode,
    cutOffTime: CutOffTime,
) : Entity<PriorityId>(priorityId) {
    var capacity: Capacity = capacity
        private set
    var capacityMode: CapacityMode = capacityMode
        private set
    var cutOffTime: CutOffTime = cutOffTime
        private set
    companion object {
        fun of(
            priorityId: PriorityId,
            companyId: CompanyId,
            capacity: Capacity,
            capacityMode: CapacityMode,
            cutOffTime: CutOffTime
        ): ShippingCompanyPriority = ShippingCompanyPriority(
            priorityId = priorityId,
            companyId = companyId,
            capacity = capacity,
            capacityMode = capacityMode,
            cutOffTime = cutOffTime
        )
    }
    fun hasCapacity() = capacity.isGreaterThanZero()
    fun deplete() {
        if(!hasCapacity()) throw PriorityHasNoCapacityException(priorityId, capacity)
        this.capacity = this.capacity.depleteOne()
    }
}
