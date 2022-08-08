package com.taager.travolta.location.service
import com.taager.travolta.location.domain.Location
import com.taager.travolta.location.domain.WarehouseLocation
import com.taager.travolta.location.repository.LocationRepository
import com.taager.travolta.warehouse.service.WarehouseResolver
import net.logstash.logback.argument.StructuredArguments.keyValue
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
@Service
class LocationVariantGetter(
    private val locationRepository: LocationRepository,
    private val warehouseResolver: WarehouseResolver,
) {
    private val log = LoggerFactory.getLogger(LocationVariantGetter::class.java)
    fun getLocationsForVariant(variantId: String, pickable: Boolean? = null, userId: String, warehouseCode: String?): List<Location> {
        val currentWarehouseCode = warehouseResolver.getCurrentWarehouseCode(userId, warehouseCode)
        return if (currentWarehouseCode != null) {
            getLocationsForVariantInWarehouse(variantId, pickable, currentWarehouseCode)
        } else {
            getLocationsForVariantInAllWarehouses(variantId, pickable)
        }
    }
    fun getByBarcode(userId: String, warehouseCode: String?, barcode: String): Location {
        val actualWarehouseCode = warehouseResolver.getCurrentWarehouseCode(userId, warehouseCode)
        val locationOption = if (actualWarehouseCode == null) {
            locationRepository.findOneByBarcode(barcode)
        } else {
            locationRepository.findOneByBarcodeAndWarehouseCode(barcode, actualWarehouseCode)
        }
        if (locationOption.isPresent) {
            log.debug("location with searched barcode $barcode found", keyValue("barcode", barcode), keyValue("warehouseCode", actualWarehouseCode))
            return locationOption.get()
        } else {
            throw LocationNotFoundException("location with barcode $barcode not found", barcode)
        }
    }
    private fun getLocationsForVariantInAllWarehouses(
        variantId: String,
        pickable: Boolean? = null
    ): List<Location> {
        return if (pickable != null) {
            locationRepository.findByVariantsVariantIdAndIsPickable(variantId, pickable)
        } else {
            locationRepository.findByVariantsVariantId(variantId)
        }
    }
    private fun getLocationsForVariantInWarehouse(
        variantId: String,
        pickable: Boolean? = null,
        warehouseCode: String
    ): List<Location> {
        return if (pickable != null) {
            locationRepository.findByVariantsVariantIdAndIsPickableAndWarehouseCode(variantId, pickable, warehouseCode)
        } else {
            locationRepository.findByVariantsVariantIdAndWarehouseCode(variantId, warehouseCode)
        }
    }
    fun getByVariantIdGroupedByWarehouse(variantId: String, pickable: Boolean? = null): List<WarehouseLocation> {
        return if (pickable != null) {
            locationRepository.findByVariantsVariantIdAndIsPickableGroupByWarehouseCode(variantId, pickable)
        } else {
            locationRepository.findByVariantsVariantIdGroupByWarehouseCode(variantId)
        }
    }
}
