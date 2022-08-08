package com.taager.travolta.picklist.command.domain.models.picklist
import com.taager.ddd.models.base.AggregateRoot
import com.taager.travolta.picklist.command.domain.events.PicklistItemPicked
import com.taager.travolta.picklist.command.domain.exceptions.*
import com.taager.travolta.picklist.common.domain.models.PicklistStatus
import com.taager.travolta.sharedkernel.domain.models.LocationBarCode
import com.taager.travolta.sharedkernel.domain.models.WarehouseCode
class Picklist(
    val picklistId: PicklistId,
    val name: PicklistName,
    val warehouseCode: WarehouseCode,
    status: PicklistStatus,
    assignedPickerId: PickerId?,
    private val assignmentsHistory: MutableList<PicklistAssignment>,
    private val items: MutableList<PicklistItem>
) : AggregateRoot<PicklistId>(picklistId) {
    var status = status
        private set
    var assignedPickerId = assignedPickerId
        private set
    companion object {
        fun new(name: PicklistName, picklistItemList: List<PicklistItemRequest>, warehouseCode: WarehouseCode): Picklist {
            if (picklistItemList.isEmpty()) throw PicklistIsEmptyException()
            return of(
                picklistId = PicklistId.newId(),
                name = name,
                warehouseCode = warehouseCode,
                status = PicklistStatus.UN_ASSIGNED,
                assignmentsHistory = mutableListOf(),
                items = picklistItemList.map { PicklistItem.new(VariantId(it.variantId), Quantity(it.quantity)) }.toMutableList()
            )
        }
        fun of(
            picklistId: PicklistId,
            name: PicklistName,
            warehouseCode: WarehouseCode,
            status: PicklistStatus,
            assignedPickerId: PickerId? = null,
            assignmentsHistory: MutableList<PicklistAssignment>,
            items: MutableList<PicklistItem>
        ): Picklist {
            return Picklist(
                picklistId = picklistId,
                name = name,
                warehouseCode = warehouseCode,
                status = status,
                assignedPickerId = assignedPickerId,
                assignmentsHistory = assignmentsHistory.toMutableList(),
                items = items.toMutableList()
            )
        }
    }
    fun assign(pickerId: PickerId, warehouseCode: WarehouseCode) {
        assertSameWarehouseCode(warehouseCode)
        assertPicklistIsNotAssigned()
        assertPicklistTransition(PicklistStatus.ASSIGNED)
        assignmentsHistory.add(PicklistAssignment.new(pickerId))
        assignedPickerId = pickerId
        status = PicklistStatus.ASSIGNED
    }
    fun unAssign(warehouseCode: WarehouseCode) {
        assertSameWarehouseCode(warehouseCode)
        assertPicklistIsNotUnAssigned()
        assertPicklistTransition(PicklistStatus.UN_ASSIGNED)
        assignedPickerId = null
        status = PicklistStatus.UN_ASSIGNED
    }
    fun pickItem(itemId: ItemId, pickerId: PickerId, quantity: Quantity, locationBarCode: LocationBarCode, warehouseCode: WarehouseCode): VariantId {
        assertSameWarehouseCode(warehouseCode)
        assertPicklistTransition(PicklistStatus.IN_PROGRESS)
        assertPicklistIsAssignedToPicker(pickerId)
        val item = getItemByIdOrThrow(itemId)
        item.pick(picklistId, quantity, locationBarCode, pickerId)
        changePicklistStatusUponItemAction()
        raiseEvent(
            PicklistItemPicked(
                itemId = itemId,
                variantId = item.variantId,
                quantity = quantity,
                locationBarCode = locationBarCode,
                warehouseCode = warehouseCode,
                pickerId = pickerId,
                pickedAt = item.lastPick()!!.pickedAt
            )
        )
        return item.variantId
    }
    fun markItemAsNotFound(itemId: ItemId, pickerId: PickerId, warehouseCode: WarehouseCode) {
        assertSameWarehouseCode(warehouseCode)
        assertPicklistTransition(PicklistStatus.IN_PROGRESS)
        assertPicklistIsAssignedToPicker(pickerId)
        val item = getItemByIdOrThrow(itemId)
        item.markAsNotFound(picklistId)
        changePicklistStatusUponItemAction()
    }
    private fun changePicklistStatusUponItemAction() {
        status = PicklistStatus.IN_PROGRESS
        if (!hasPendingItems()) {
            status = PicklistStatus.COMPLETED
            assignedPickerId = null
        }
    }
    fun getAssignments() = assignmentsHistory.toMutableList()
    fun getItems() = items.toMutableList()
    private fun assertSameWarehouseCode(warehouseCode: WarehouseCode) {
        if (warehouseCode != this.warehouseCode) {
            throw PicklistCannotBeModifiedFromDiffWarehouseException(
                id = picklistId,
                picklistWarehouseCode = this.warehouseCode,
                requestWarehouseCode = warehouseCode
            )
        }
    }
    private fun assertPicklistIsNotAssigned() {
        if (PicklistStatus.ASSIGNED == status) {
            throw PicklistIsAlreadyAssignedException(picklistId, assignedPickerId!!)
        }
    }
    private fun assertPicklistIsNotUnAssigned() {
        if (PicklistStatus.UN_ASSIGNED == status) {
            throw PicklistIsAlreadyUnAssignedException(picklistId)
        }
    }
    private fun assertPicklistIsAssignedToPicker(pickerId: PickerId) {
        if (assignedPickerId != pickerId) {
            throw PicklistIsAssignedToAnotherPickerException(picklistId, pickerId)
        }
    }
    private fun assertPicklistTransition(targetStatus: PicklistStatus) {
        if (transitionAllowedTo(targetStatus))
            throw IllegalPicklistStatusTransitionException(status, targetStatus, lastAssignment()?.assignedAt)
    }
    private fun getItemByIdOrThrow(itemId: ItemId) = items.firstOrNull { it.itemId == itemId } ?: throw PicklistItemNotFoundByIdException(itemId)
    private fun transitionAllowedTo(targetStatus: PicklistStatus) = allowedTransitions.getOrDefault(status, listOf()).contains(targetStatus).not()
    private fun lastAssignment() = assignmentsHistory.maxByOrNull { it.assignedAt }
    private val allowedTransitions = mapOf(
        PicklistStatus.UN_ASSIGNED to listOf(PicklistStatus.ASSIGNED),
        PicklistStatus.ASSIGNED to listOf(PicklistStatus.IN_PROGRESS, PicklistStatus.UN_ASSIGNED),
        PicklistStatus.IN_PROGRESS to listOf(PicklistStatus.COMPLETED, PicklistStatus.IN_PROGRESS, PicklistStatus.UN_ASSIGNED),
        PicklistStatus.COMPLETED to listOf()
    )
    private fun hasPendingItems() = items.any { it.isPending() }
}
data class PicklistItemRequest(val variantId: String, val quantity: Int)
