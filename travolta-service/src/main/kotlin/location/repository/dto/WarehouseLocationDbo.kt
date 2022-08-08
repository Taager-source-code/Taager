package com.taager.travolta.location.repository.dbo
import org.springframework.data.annotation.Id
data class WarehouseLocationDbo(
    @Id val warehouseCode: String?,
    val locations: List<LocationDbo>
)
