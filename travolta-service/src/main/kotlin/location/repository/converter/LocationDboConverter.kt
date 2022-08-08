package com.taager.travolta.location.repository.converter
import com.taager.travolta.location.domain.Location
import com.taager.travolta.location.domain.LocationMetadata
import com.taager.travolta.location.domain.LocationVariant
import com.taager.travolta.location.repository.dbo.LocationDbo
import com.taager.travolta.location.repository.dbo.LocationMetadataDbo
import com.taager.travolta.location.repository.dbo.LocationVariantDbo
import org.springframework.stereotype.Component
@Component
class LocationDboConverter {
    fun convert(locationDomain: Location): LocationDbo {
        return LocationDbo(
            id = locationDomain.id,
            barcode = locationDomain.barcode,
            isPickable = locationDomain.isPickable,
            metadata = convert(locationDomain.metadata),
            variants = locationDomain.getVariants().map { convert(it) },
            warehouseCode = locationDomain.warehouseCode
        ).also {
            it.createdAt = locationDomain.createdAt
            it.updatedAt = locationDomain.updatedAt
        }
    }
    fun convert(locationDbo: LocationDbo): Location {
        return Location(
            id = locationDbo.id,
            barcode = locationDbo.barcode,
            isPickable = locationDbo.isPickable,
            metadata = convert(locationDbo.metadata),
            variants = locationDbo.variants.map { convert(it) }.toMutableList(),
            warehouseCode = locationDbo.warehouseCode
        ).also {
            it.createdAt = locationDbo.createdAt
            it.updatedAt = locationDbo.updatedAt
        }
    }
    fun convert(locationMetadataDbo: LocationMetadataDbo): LocationMetadata {
        return LocationMetadata(
            aisle = locationMetadataDbo.aisle
        )
    }
    fun convert(locationMetadataDomain: LocationMetadata): LocationMetadataDbo {
        return LocationMetadataDbo(
            aisle = locationMetadataDomain.aisle
        )
    }
    fun convert(locationVariantsDbo: LocationVariantDbo): LocationVariant {
        return LocationVariant(
            variantId = locationVariantsDbo.variantId,
            quantity = locationVariantsDbo.quantity,
        )
    }
    fun convert(locationVariantsDomain: LocationVariant): LocationVariantDbo {
        return LocationVariantDbo(
            variantId = locationVariantsDomain.variantId,
            quantity = locationVariantsDomain.getQuantity(),
        )
    }
}