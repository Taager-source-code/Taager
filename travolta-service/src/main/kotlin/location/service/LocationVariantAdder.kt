package com.taager.travolta.location.service
import com.taager.travolta.common.reporting.useractions.UserActionPublisher
import com.taager.travolta.common.reporting.useractions.domain.VariantAdded
import com.taager.travolta.location.domain.LocationVariant
import com.taager.travolta.location.domain.LocationVariantUpdate
import com.taager.travolta.location.repository.LocationRepository
import com.taager.travolta.warehouse.service.WarehouseResolver
import net.logstash.logback.argument.StructuredArguments.keyValue
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
@Service
class LocationVariantAdder(
    private val locationRepository: LocationRepository,
    private val warehouseResolver: WarehouseResolver,
    private val userActionPublisher: UserActionPublisher
) {
    private val log = LoggerFactory.getLogger(LocationVariantAdder::class.java)
    fun addVariant(userId: String, warehouseCode: String?, locationVariantUpdate: LocationVariantUpdate) {
        val currentWarehouseCode = warehouseResolver.getCurrentWarehouseCode(userId, warehouseCode)
        val locationOption = if (currentWarehouseCode == null) {
            locationRepository.findById(locationVariantUpdate.locationId)
        } else {
            locationRepository.findByIdAndWarehouseCode(locationVariantUpdate.locationId, currentWarehouseCode)
        }
        val location = locationOption.orElseThrow { LocationNotFoundException("location not found", locationVariantUpdate.locationId, currentWarehouseCode) }
        val variant = LocationVariant(variantId = locationVariantUpdate.variantId, quantity = locationVariantUpdate.quantity)
        location.addVariant(variant)
        locationRepository.save(location)
        logAdd(userId, location.barcode,locationVariantUpdate)
    }
    private fun logAdd(userId: String, locationBarCode: String, locationVariantUpdate: LocationVariantUpdate) {
        userActionPublisher.publish(
            VariantAdded(
                userId = userId,
                variantId = locationVariantUpdate.variantId,
                locationId = locationVariantUpdate.locationId,
                locationBarCode = locationBarCode,
                quantity = locationVariantUpdate.quantity
            )
        )
        log.info(
            "Variant added in location ",
            keyValue("variantId", locationVariantUpdate.variantId),
            keyValue("locationId", locationVariantUpdate.locationId),
            keyValue("quantity", locationVariantUpdate.quantity)
        )
    }
}
