package com.taager.travolta.shipment.command.domain.contracts
import com.taager.travolta.sharedkernel.domain.models.LocationBarCode
import com.taager.travolta.sharedkernel.domain.models.UserId
import com.taager.travolta.sharedkernel.domain.models.WarehouseCode
import com.taager.travolta.shipment.command.domain.models.shipment.Quantity
import com.taager.travolta.shipment.command.domain.models.shipment.VariantId
abstract class LocationReturnedVariantAdderUseCase {
    abstract fun addToLocation(locationReturnedVariantUpdateDto: LocationReturnedVariantUpdateDto)
}
data class LocationReturnedVariantUpdateDto(
    val variantId: VariantId,
    val userId: UserId,
    val quantity: Quantity,
    val locationBarCode: LocationBarCode,
    val warehouseCode: WarehouseCode
)