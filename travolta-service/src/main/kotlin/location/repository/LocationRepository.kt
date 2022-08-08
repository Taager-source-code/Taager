package com.taager.travolta.location.repository
import com.taager.travolta.location.domain.Location
import com.taager.travolta.location.domain.WarehouseLocation
import com.taager.travolta.location.repository.converter.LocationDboConverter
import com.taager.travolta.location.repository.converter.WarehouseLocationDboConverter
import com.taager.travolta.location.repository.dbo.LocationDbo
import com.taager.travolta.location.repository.dbo.WarehouseLocationDbo
import org.springframework.data.mongodb.repository.Aggregation
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.util.*
@Repository
class LocationRepository(
    val locationRepositoryInternal: LocationRepositoryInternal,
    val locationConverter: LocationDboConverter,
    val warehouseLocationConverter: WarehouseLocationDboConverter
) {
    fun findByVariantsVariantId(variantId: String): List<Location> {
        val locations = locationRepositoryInternal.findByVariantsVariantId(variantId)
        return locations.map { locationConverter.convert(it) }
    }
    fun findByVariantsVariantIdAndIsPickable(variantId: String, pickable: Boolean): List<Location>{
        val locations = locationRepositoryInternal.findByVariantsVariantIdAndIsPickable(variantId, pickable)
        return locations.map { locationConverter.convert(it) }
    }
    fun findOneByBarcode(barcode: String): Optional<Location> {
        val location = locationRepositoryInternal.findOneByBarcode(barcode)
        return location.map { locationConverter.convert(it) }
    }
    fun findByVariantsVariantIdAndWarehouseCode(variantId: String, warehouseCode: String): List<Location> {
        val locations = locationRepositoryInternal.findByVariantsVariantIdAndWarehouseCode(variantId,warehouseCode)
        return locations.map { locationConverter.convert(it) }
    }
    fun findByVariantsVariantIdAndIsPickableAndWarehouseCode(
        variantId: String,
        pickable: Boolean,
        warehouseCode: String
    ): List<Location> {
        val locations = locationRepositoryInternal.findByVariantsVariantIdAndIsPickableAndWarehouseCode(variantId, pickable,warehouseCode)
        return locations.map { locationConverter.convert(it) }
    }
    fun findOneByBarcodeAndWarehouseCode(barcode: String, warehouseCode: String): Optional<Location> {
        val location = locationRepositoryInternal.findOneByBarcodeAndWarehouseCode(barcode,warehouseCode)
        return location.map { locationConverter.convert(it) }
    }
    fun save(location: Location) {
        val locationDbo = locationConverter.convert(location)
        locationRepositoryInternal.save(locationDbo)
    }
    fun findById(locationId: String): Optional<Location> {
        val location = locationRepositoryInternal.findById(locationId)
        return location.map { locationConverter.convert(it) }
    }
    fun findByIdAndWarehouseCode(locationId: String, warehouseCode: String): Optional<Location> {
        val location = locationRepositoryInternal.findByIdAndWarehouseCode(locationId, warehouseCode)
        return location.map { locationConverter.convert(it) }
    }
    fun findByVariantsVariantIdGroupByWarehouseCode(barcode: String): List<WarehouseLocation> {
        val dbos = locationRepositoryInternal.findByVariantsVariantIdGroupByWarehouseCode(barcode)
        return dbos.map { warehouseLocationConverter.convert(it) }
    }
    fun findByVariantsVariantIdAndIsPickableGroupByWarehouseCode(barcode: String, pickable: Boolean): List<WarehouseLocation> {
        val dbos = locationRepositoryInternal.findByVariantsVariantIdAndIsPickableGroupByWarehouseCode(barcode, pickable)
        return dbos.map { warehouseLocationConverter.convert(it) }
    }
}
@Repository
interface LocationRepositoryInternal : MongoRepository<LocationDbo, String> {
    fun findByIdAndWarehouseCode(id: String, warehouseCode: String): Optional<LocationDbo>
    fun findByVariantsVariantIdAndWarehouseCode(variantId: String, warehouseCode: String): List<LocationDbo>
    fun findByVariantsVariantIdAndIsPickableAndWarehouseCode(variantId: String, pickable: Boolean, warehouseCode: String): List<LocationDbo>
    fun findOneByBarcodeAndWarehouseCode(barcode: String, warehouseCode: String): Optional<LocationDbo>
    fun findByVariantsVariantId(variantId: String): List<LocationDbo>
    fun findByVariantsVariantIdAndIsPickable(variantId: String, pickable: Boolean): List<LocationDbo>
    fun findOneByBarcode(barcode: String): Optional<LocationDbo>
    @Aggregation(
        "{\$match:{'variants.variantId' : ?0}}",
        "{ \$group : { _id : \$warehouseCode, locations:{\$push: \$\$ROOT }} }"
    )
    fun findByVariantsVariantIdGroupByWarehouseCode(variantId: String): List<WarehouseLocationDbo>
    @Aggregation(
        "{\$match:{\$and:[{'variants.variantId' : ?0}, {'isPickable': ?1}]}}",
        "{ \$group : { _id : \$warehouseCode, locations:{\$push: \$\$ROOT }} }"
    )
    fun findByVariantsVariantIdAndIsPickableGroupByWarehouseCode(variantId: String, pickable: Boolean): List<WarehouseLocationDbo>
}
