package com.taager.travolta.picklist.command.domain.models.picklist
import com.taager.travolta.picklist.command.domain.exceptions.InvalidQuantityException
import com.taager.travolta.picklist.command.domain.exceptions.ItemAlreadyPickedException
import com.taager.travolta.picklist.command.domain.exceptions.PickedQuantityIsMoreThanItemQuantityException
import com.taager.travolta.picklist.common.domain.models.PicklistItemStatus
import com.taager.travolta.sharedkernel.domain.models.LocationBarCode
class PicklistItem(
    val itemId: ItemId,
    val variantId: VariantId,
    quantity: Quantity,
    status: PicklistItemStatus,
    private val picks: MutableList<PicklistItemPick>
) {
    var status: PicklistItemStatus = status
        private set
    var remainingQuantity: Quantity = quantity
        private set
    companion object {
        fun new(variantId: VariantId, quantity: Quantity): PicklistItem {
            assertZeroQuantity(quantity)
            return of(
                itemId = ItemId.newId(),
                variantId = variantId,
                quantity = quantity,
                status = PicklistItemStatus.PENDING,
                picks = mutableListOf()
            )
        }
        fun of(itemId: ItemId, variantId: VariantId, quantity: Quantity, status: PicklistItemStatus, picks: MutableList<PicklistItemPick>): PicklistItem {
            return PicklistItem(
                itemId = itemId,
                variantId = variantId,
                quantity = quantity,
                status = status,
                picks = picks
            )
        }
        private fun assertZeroQuantity(quantity: Quantity) {
            if (quantity == Quantity.empty()) {
                throw InvalidQuantityException(quantity)
            }
        }
    }
    fun pick(picklistId: PicklistId, quantity: Quantity, locationBarCode: LocationBarCode, pickedBy: PickerId) {
        assertThatItemIsNotPicked(picklistId)
        assertPickedQuantityNotExceedingItemQuantity(picklistId, quantity)
        picks.add(PicklistItemPick.new(quantity, locationBarCode, pickedBy))
        this.remainingQuantity -= quantity
        if (this.remainingQuantity == Quantity.empty()) status = PicklistItemStatus.PICKED
    }
    fun markAsNotFound(picklistId: PicklistId) {
        assertThatItemIsNotClosed(picklistId)
        if (this.getPicks().isEmpty()) {
            status = PicklistItemStatus.NOT_FOUND
        } else {
            status = PicklistItemStatus.PARTIALLY_PICKED
        }
    }
    fun isPending() = status == PicklistItemStatus.PENDING
    fun lastPick() = picks.maxByOrNull { it.pickedAt }
    fun getPicks() = picks.toMutableList()
    private fun assertThatItemIsNotPicked(picklistId: PicklistId) {
        if (status == PicklistItemStatus.PICKED) {
            throw ItemAlreadyPickedException(picklistId, itemId)
        }
    }
    private fun assertThatItemIsNotClosed(picklistId: PicklistId) {
        if (!isPending()) {
            throw ItemAlreadyPickedException(picklistId, itemId)
        }
    }
    private fun assertPickedQuantityNotExceedingItemQuantity(picklistId: PicklistId, pickedQuantity: Quantity) {
        if (pickedQuantity > this.remainingQuantity) {
            throw PickedQuantityIsMoreThanItemQuantityException(picklistId, itemId, pickedQuantity, remainingQuantity)
        }
    }
}
class PicklistItemPick(val pickedQuantity: Quantity, val locationBarCode: LocationBarCode, val pickedBy: PickerId, val pickedAt: PickedAt) {
    init {
        if (pickedQuantity == Quantity.empty()) {
            throw InvalidQuantityException(pickedQuantity)
        }
    }
    companion object {
        fun new(quantity: Quantity, locationBarCode: LocationBarCode, pickedBy: PickerId): PicklistItemPick {
            return PicklistItemPick(quantity, locationBarCode, pickedBy, PickedAt.now())
        }
    }
}
