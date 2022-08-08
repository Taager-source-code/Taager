package com.taager.travolta.picklist.query.application.contracts
import com.taager.travolta.picklist.common.domain.models.PicklistItemStatus
import com.taager.travolta.picklist.common.domain.models.PicklistStatus
import java.util.*
abstract class PicklistQueryRepo {
    abstract fun getByAssignedPickerId(assignedPickerId: String): Optional<Picklist>
}
data class Picklist(
    val picklistId: String,
    val name: String,
    val status: PicklistStatus,
    val assignedPickerId: String?,
    val warehouseCode: String,
    val items: List<PicklistItemRead>
)
data class PicklistItemRead(
    val itemId: String,
    val variantId: String,
    val remainingQuantity: Int,
    val status: PicklistItemStatus
)
