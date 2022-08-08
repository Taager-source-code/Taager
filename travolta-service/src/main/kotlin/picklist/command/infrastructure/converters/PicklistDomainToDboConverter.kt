package com.taager.travolta.picklist.command.infrastructure.repositories.converters
import com.taager.travolta.picklist.command.domain.models.picklist.Picklist
import com.taager.travolta.picklist.command.domain.models.picklist.PicklistAssignment
import com.taager.travolta.picklist.command.domain.models.picklist.PicklistItem
import com.taager.travolta.picklist.command.domain.models.picklist.PicklistItemPick
import com.taager.travolta.picklist.common.infrastructure.repositories.db.PicklistAssignmentDbo
import com.taager.travolta.picklist.common.infrastructure.repositories.db.PicklistDbo
import com.taager.travolta.picklist.common.infrastructure.repositories.db.PicklistItemDbo
import com.taager.travolta.picklist.common.infrastructure.repositories.db.PicklistItemPickDbo
import org.springframework.stereotype.Component
@Component
class PicklistDomainToDboConverter {
    fun convert(picklist: Picklist) = PicklistDbo(
        id = picklist.picklistId.toString(),
        name = picklist.name.value,
        warehouseCode = picklist.warehouseCode.value,
        status = picklist.status.value,
        assignedPickerId = picklist.assignedPickerId?.toString(),
        assignmentsHistory = picklist.getAssignments().map { toAssignmentsDbo(it) },
        items = picklist.getItems().map { toItemsDbo(it) }
    )
    private fun toAssignmentsDbo(assignment: PicklistAssignment) = PicklistAssignmentDbo(
        assignedTo = assignment.assignedTo.value,
        assignedAt = assignment.assignedAt.primitiveForm()
    )
    private fun toItemsDbo(item: PicklistItem) = PicklistItemDbo(
        itemId = item.itemId.toString(),
        variantId = item.variantId.value,
        remainingQuantity = item.remainingQuantity.value,
        status = item.status.value,
        picks = item.getPicks().map { toItemPicksDbo(it) }
    )
    private fun toItemPicksDbo(itemPick: PicklistItemPick) = PicklistItemPickDbo(
        locationBarCode = itemPick.locationBarCode.value,
        pickedBy = itemPick.pickedBy.value,
        pickedAt = itemPick.pickedAt.primitiveForm(),
        pickedQuantity = itemPick.pickedQuantity.value
    )
}
