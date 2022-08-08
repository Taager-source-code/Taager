package com.taager.travolta.picklist.command.domain.events
import com.taager.ddd.models.base.DomainEvent
import com.taager.travolta.picklist.command.domain.models.picklist.*
import com.taager.travolta.sharedkernel.domain.models.LocationBarCode
import com.taager.travolta.sharedkernel.domain.models.WarehouseCode
sealed class PicklistEvent : DomainEvent
data class PicklistItemPicked(
    val itemId: ItemId,
    val variantId: VariantId,
    val quantity: Quantity,
    val locationBarCode: LocationBarCode,
    val warehouseCode: WarehouseCode,
    val pickerId: PickerId,
    val pickedAt: PickedAt
) : PicklistEvent()
