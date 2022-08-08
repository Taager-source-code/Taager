package com.taager.allocation.capacity.commands.domain.exceptions
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.domain.models.OrderStatus
import com.taager.allocation.sharedkernel.domain.models.valueobjects.Capacity
import com.taager.allocation.sharedkernel.domain.models.valueobjects.CapacityMode
import com.taager.allocation.sharedkernel.domain.models.valueobjects.PriorityId
sealed class RequirementException(message: String) : RuntimeException(message)
data class DesiredOrderMissingSomePrioritiesException(val prioritiesSize: Int, val desiredSortingSize: Int) :
    RequirementException("Desired priorities $desiredSortingSize doesn't match the current Priorities size $prioritiesSize")
class CapacityCanNoBeEmptyException : RequirementException("Capacity can not be empty")
data class IllegalCapacityUpdateException(val capacityMode: CapacityMode) :
    RequirementException("Can not update province's capacity because this priority's capacity set as ${capacityMode.value}")
data class CapacityRequiredException(val capacityMode: CapacityMode) :
    RequirementException("Capacity is required for $capacityMode")
data class RemainingCapacityRequiredException(val capacityMode: CapacityMode) :
    RequirementException("RemainingCapacity is required for $capacityMode")
data class PriorityAlreadyFoundException(val priorityId: PriorityId) : RequirementException("$priorityId already exist")
data class PriorityHasNoCapacityException(val priorityId: PriorityId, val capacity: Capacity) :
    RequirementException("[$priorityId] doesn't have [$capacity]")
data class OrderCanNotBeAllocatedException(val orderId: OrderId, val status: OrderStatus) :
    RequirementException("Can't allocate order [$orderId] because order status is [$status]")