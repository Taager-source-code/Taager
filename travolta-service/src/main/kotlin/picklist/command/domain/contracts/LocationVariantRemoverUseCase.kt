package com.taager.travolta.picklist.command.domain.contracts
import com.taager.travolta.picklist.command.domain.models.picklist.PickerId
import com.taager.travolta.picklist.command.domain.models.picklist.Quantity
import com.taager.travolta.picklist.command.domain.models.picklist.VariantId
import com.taager.travolta.sharedkernel.domain.models.LocationBarCode
import com.taager.travolta.sharedkernel.domain.models.WarehouseCode
abstract class LocationVariantRemoverUseCase {
    abstract fun deductFromLocation(locationVariantUpdateDto: LocationVariantUpdateDto)
}
data class LocationVariantUpdateDto(
    val variantId: VariantId,
    val pickerId: PickerId,
    val quantity: Quantity,
    val locationBarCode: LocationBarCode,
    val warehouseCode: WarehouseCode
)
