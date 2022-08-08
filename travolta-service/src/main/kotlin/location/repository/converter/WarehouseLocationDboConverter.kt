package com.taager.travolta.location.repository.converter
import com.taager.travolta.location.domain.WarehouseLocation
import com.taager.travolta.location.repository.dbo.WarehouseLocationDbo
import org.springframework.stereotype.Component
@Component
class WarehouseLocationDboConverter(private val locationDboConverter: LocationDboConverter) {
    fun convert(warehouseLocationDbo: WarehouseLocationDbo): WarehouseLocation {
        val locations = warehouseLocationDbo.locations.map { locationDboConverter.convert(it) }
        return WarehouseLocation(warehouseCode = warehouseLocationDbo.warehouseCode, locations = locations)
    }
}
