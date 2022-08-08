package com.taager.travolta.location.controller.converter
import com.taager.travolta.location.domain.*
import com.taager.travolta.openapi.model.*
import org.springframework.stereotype.Component
@Component
class WarehouseLocationDtoConverter(private val locationDtoConverter: LocationDtoConverter) {
    fun convert(warehouseLocation: WarehouseLocation, variantId: String): WarehouseVariantLocationsDto {
        val locations = warehouseLocation.locations.map { locationDtoConverter.convert(it, variantId) }
        return WarehouseVariantLocationsDto(
            warehouseCode = warehouseLocation.warehouseCode,
            variantLocations = locations
        )
    }
}
