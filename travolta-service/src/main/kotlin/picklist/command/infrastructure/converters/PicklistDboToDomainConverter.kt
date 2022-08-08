package com.taager.travolta.picklist.command.infrastructure.repositories.converters
import com.taager.travolta.picklist.command.domain.models.picklist.*
import com.taager.travolta.picklist.common.domain.models.PicklistItemStatus
import com.taager.travolta.picklist.common.domain.models.PicklistStatus
import com.taager.travolta.picklist.common.infrastructure.repositories.db.PicklistAssignmentDbo
import com.taager.travolta.picklist.common.infrastructure.repositories.db.PicklistDbo
import com.taager.travolta.picklist.common.infrastructure.repositories.db.PicklistItemDbo
import com.taager.travolta.picklist.common.infrastructure.repositories.db.PicklistItemPickDbo
import com.taager.travolta.sharedkernel.domain.models.LocationBarCode
import com.taager.travolta.sharedkernel.domain.models.Moment
import com.taager.travolta.sharedkernel.domain.models.WarehouseCode
import org.springframework.stereotype.Component
@Component
class PicklistDboToDomainConverter {
    fun convert(picklistDbo: PicklistDbo) = Picklist.of(
        picklistId = PicklistId.of(picklistDbo.id),
        name = PicklistName(picklistDbo.name),
        warehouseCode = WarehouseCode(picklistDbo.warehouseCode),
        status = PicklistStatus.valueOf(picklistDbo.status),
        assignedPickerId = picklistDbo.assignedPickerId?.let{ PickerId(it) },
        assignmentsHistory = picklistDbo.assignmentsHistory.map { toAssignmentDomain(it) }.toMutableList(),
        items = picklistDbo.items.map { toItemDomain(it) }.toMutableList(),
    )
    private fun toAssignmentDomain(assignmentDbo: PicklistAssignmentDbo) = PicklistAssignment(
        assignedTo = PickerId(assignmentDbo.assignedTo),
        assignedAt = AssignedAt(Moment(assignmentDbo.assignedAt))
    )
    private fun toItemDomain(itemDbo: PicklistItemDbo) = PicklistItem(
        itemId = ItemId.of(itemDbo.itemId),
        variantId = VariantId(itemDbo.variantId),
        quantity = Quantity(itemDbo.remainingQuantity),
        status = PicklistItemStatus.valueOf(itemDbo.status),
        picks = itemDbo.picks.map { toItemPicksDomain(it) }.toMutableList(),
    )
    private fun toItemPicksDomain(itemPickDbo: PicklistItemPickDbo) = PicklistItemPick(
        locationBarCode = LocationBarCode(itemPickDbo.locationBarCode),
        pickedBy = PickerId(itemPickDbo.pickedBy),
        pickedAt = PickedAt(itemPickDbo.pickedAt),
        pickedQuantity = Quantity(itemPickDbo.pickedQuantity)
    )
}