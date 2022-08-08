package com.taager.travolta.picklist.command.infrastructure.repositories.gateways
import com.taager.travolta.location.domain.LocationVariantUpdate
import com.taager.travolta.location.domain.RemovalMode
import com.taager.travolta.location.service.LocationVariantGetter
import com.taager.travolta.location.service.LocationVariantRemover
import com.taager.travolta.picklist.command.domain.contracts.LocationVariantRemoverUseCase
import com.taager.travolta.picklist.command.domain.contracts.LocationVariantUpdateDto
import org.springframework.stereotype.Component
@Component
class LocationVariantRemoverUseCaseImpl(
    private val locationVariantGetter: LocationVariantGetter,
    private val locationVariantRemover: LocationVariantRemover
) : LocationVariantRemoverUseCase() {
    override fun deductFromLocation(locationVariantUpdateDto: LocationVariantUpdateDto) {
        val location = locationVariantGetter.getByBarcode(
            locationVariantUpdateDto.pickerId.value,
            locationVariantUpdateDto.warehouseCode.value,
            locationVariantUpdateDto.locationBarCode.value
        )
        val locationVariantUpdate = LocationVariantUpdate(
            locationId = location.id!!,
            variantId = locationVariantUpdateDto.variantId.value,
            quantity = locationVariantUpdateDto.quantity.value
        )
        locationVariantRemover.removeVariant(
            userId = locationVariantUpdateDto.pickerId.value,
            warehouseCode = locationVariantUpdateDto.warehouseCode.value,
            locationVariantUpdate = locationVariantUpdate,
            removalMode = RemovalMode.STRICT
        )
    }
}
