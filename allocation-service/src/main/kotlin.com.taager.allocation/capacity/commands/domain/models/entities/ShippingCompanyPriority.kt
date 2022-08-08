package com.taager.allocation.capacity.commands.domain.models.entities
import com.taager.allocation.capacity.commands.domain.exceptions.CapacityCanNotBeLowerThanExhaustedCapacityException
import com.taager.allocation.sharedkernel.domain.models.base.Entity
import com.taager.allocation.sharedkernel.domain.models.valueobjects.*
class ShippingCompanyPriority private constructor(
    val priorityId: PriorityId,
    val companyId: CompanyId,
    inTesting: Boolean,
    capacity: Capacity,
    remainingCapacity: Capacity,
    capacityMode: CapacityMode,
    cutOfTime: CutOffTime,
) : Entity<PriorityId>(priorityId) {
    var inTesting: Boolean = inTesting
        private set
    var capacity: Capacity = capacity
        private set
    var remainingCapacity: Capacity = remainingCapacity
        private set
    var capacityMode: CapacityMode = capacityMode
        private set
    var cutOfTime: CutOffTime = cutOfTime
        private set
    companion object {
        fun of(
            priorityId: PriorityId,
            companyId: CompanyId,
            inTesting: Boolean,
            capacity: Capacity,
            remainingCapacity: Capacity,
            capacityMode: CapacityMode,
            cutOfTime: CutOffTime
        ): ShippingCompanyPriority = ShippingCompanyPriority(
            priorityId = priorityId,
            companyId = companyId,
            inTesting = inTesting,
            capacity = capacity,
            remainingCapacity = remainingCapacity,
            capacityMode = capacityMode,
            cutOfTime = cutOfTime
        )
        fun new(
            capacity: Capacity,
            remainingCapacity: Capacity,
            companyId: CompanyId,
            inTesting: Boolean,
            capacityMode: CapacityMode,
            cutOfTime: CutOffTime
        ): ShippingCompanyPriority = of(
            priorityId = PriorityId.newId(),
            companyId = companyId,
            inTesting = inTesting,
            capacity = capacity,
            remainingCapacity = remainingCapacity,
            capacityMode = capacityMode,
            cutOfTime = cutOfTime
        )
    }
    fun cloneWithDiffCapacity(capacity: Capacity) = ShippingCompanyPriority(
        priorityId = priorityId,
        companyId = companyId,
        inTesting = inTesting,
        capacity = capacity,
        remainingCapacity = capacity,
        capacityMode = capacityMode,
        cutOfTime = cutOfTime
    )
    fun clone() = ShippingCompanyPriority(
        priorityId = priorityId,
        companyId = companyId,
        inTesting = inTesting,
        capacity = capacity,
        remainingCapacity = remainingCapacity,
        capacityMode = capacityMode,
        cutOfTime = cutOfTime
    )
    fun updateCapacity(capacity: Capacity) {
        assertValidCapacityUpdate(capacity)
        this.capacity = capacity
    }
    fun updateRemainingCapacity(remainingCapacity: Capacity) {
        this.remainingCapacity = remainingCapacity
    }
    fun updateTestingStatus(status: Boolean) {
        inTesting = status
    }
    fun updateCapacityMode(capacityMode: CapacityMode) {
        this.capacityMode = capacityMode
    }
    fun updateCutOffTime(cutOfTime: CutOffTime) {
        this.cutOfTime = cutOfTime
    }
    private fun assertValidCapacityUpdate(capacity: Capacity) {
        if ( capacity.value < this.getExhaustedCapacity() ) {
            throw CapacityCanNotBeLowerThanExhaustedCapacityException(capacity.value, this.getExhaustedCapacity())
        }
    }
    private fun getExhaustedCapacity(): Int {
        return this.capacity.value - this.remainingCapacity.value
    }
}