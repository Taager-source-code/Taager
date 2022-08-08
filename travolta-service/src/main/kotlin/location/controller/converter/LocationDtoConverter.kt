package com.taager.travolta.location.controller.converter
import com.taager.travolta.location.domain.Location
import com.taager.travolta.location.domain.LocationMetadata
import com.taager.travolta.location.domain.LocationVariantUpdate
import com.taager.travolta.location.domain.RemovalMode
import com.taager.travolta.openapi.model.*
import org.springframework.stereotype.Component
@Component
class LocationDtoConverter {
    fun convert(locationDomain: Location): LocationDto {
        return LocationDto(
            id = locationDomain.id,
            barcode = locationDomain.barcode,
            pickable = locationDomain.isPickable,
            warehouseCode = locationDomain.warehouseCode,
            metadata = convert(locationDomain.metadata)
        )
    }
    fun convert(location: Location, variantId: String): VariantLocationDto {
        return VariantLocationDto(
            location = convert(location),
            quantity = location.getVariants().first { it.variantId == variantId }.getQuantity()
        )
    }
    fun convert(locationMetadataDomain: LocationMetadata): LocationDtoMetadata {
        return LocationDtoMetadata(
            aisle = locationMetadataDomain.aisle,
        )
    }
    fun convert(removalModeDto: RemovalModeDto): RemovalMode {
        return when(removalModeDto){
            RemovalModeDto.strict -> RemovalMode.STRICT
            RemovalModeDto.flexible -> RemovalMode.FLEXIBLE
        }
    }
    fun convert(locationVariantDto: VariantUpdateDto): LocationVariantUpdate {
        return LocationVariantUpdate(
                locationId = locationVariantDto.locationId,
                variantId = locationVariantDto.variantId,
                quantity = locationVariantDto.quantity
        )
    }
}
