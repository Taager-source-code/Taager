package com.taager.travolta.picklist.command.domain.services
import com.taager.travolta.picklist.command.domain.models.picklist.*
import com.taager.travolta.sharedkernel.domain.models.LocationBarCode
import com.taager.travolta.sharedkernel.domain.models.WarehouseCode
import com.taager.travolta.picklist.command.domain.contracts.LocationVariantRemoverUseCase
import com.taager.travolta.picklist.command.domain.contracts.LocationVariantUpdateDto
import org.springframework.stereotype.Component
@Component
class PicklistPickingService(
    private val locationVariantRemoverUseCase: LocationVariantRemoverUseCase
) {
    fun pick(picklist: Picklist, picklistItemPickingRequest: PicklistItemPickingRequest) {
        val variantId = picklist.pickItem(
            itemId = picklistItemPickingRequest.itemId,
            pickerId = picklistItemPickingRequest.pickerId,
            locationBarCode = picklistItemPickingRequest.locationBarCode,
            quantity = picklistItemPickingRequest.quantity,
            warehouseCode = picklistItemPickingRequest.warehouseCode
        )
        locationVariantRemoverUseCase.deductFromLocation(
            LocationVariantUpdateDto(
                variantId = variantId,
                pickerId = picklistItemPickingRequest.pickerId,
                quantity = picklistItemPickingRequest.quantity,
                locationBarCode = picklistItemPickingRequest.locationBarCode,
                warehouseCode = picklistItemPickingRequest.warehouseCode
            )
        )
    }
}
data class PicklistItemPickingRequest(
    val picklistId: PicklistId,
    val itemId: ItemId,
    val pickerId: PickerId,
    val quantity: Quantity,
    val locationBarCode: LocationBarCode,
    val warehouseCode: WarehouseCode
)
