package com.taager.travolta.picklist.query.infrastructure.repositories.converters
import com.taager.travolta.picklist.common.domain.models.PicklistItemStatus
import com.taager.travolta.picklist.common.domain.models.PicklistStatus
import com.taager.travolta.picklist.common.infrastructure.repositories.db.PicklistDbo
import com.taager.travolta.picklist.common.infrastructure.repositories.db.PicklistItemDbo
import com.taager.travolta.picklist.query.application.contracts.Picklist
import com.taager.travolta.picklist.query.application.contracts.PicklistItemRead
import org.springframework.stereotype.Component
@Component
class PicklistDboToReadDataConverter {
    fun convert(picklistDbo: PicklistDbo) = Picklist(
        picklistId = picklistDbo.id,
        name = picklistDbo.name,
        status = PicklistStatus.valueOf(picklistDbo.status),
        assignedPickerId = picklistDbo.assignedPickerId,
        warehouseCode = picklistDbo.warehouseCode,
        items = picklistDbo.items.map { toItemRead(it) },
    )
    private fun toItemRead(itemDbo: PicklistItemDbo) = PicklistItemRead(
        itemId = itemDbo.itemId,
        variantId = itemDbo.variantId,
        remainingQuantity = itemDbo.remainingQuantity,
        status = PicklistItemStatus.valueOf(itemDbo.status)
    )
}
