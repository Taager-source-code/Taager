package com.taager.travolta.location.service
import com.taager.travolta.common.reporting.useractions.UserActionPublisher
import com.taager.travolta.common.reporting.useractions.domain.VariantRemoved
import com.taager.travolta.location.domain.LocationVariant
import com.taager.travolta.location.domain.LocationVariantUpdate
import com.taager.travolta.location.domain.RemovalMode
import com.taager.travolta.location.repository.LocationRepository
import com.taager.travolta.warehouse.service.WarehouseResolver
import net.logstash.logback.argument.StructuredArguments
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
@Service
class LocationVariantRemover(
    private val locationRepository: LocationRepository,
    private val warehouseResolver: WarehouseResolver,
    private val userActionPublisher: UserActionPublisher
) {
    private val log = LoggerFactory.getLogger(LocationVariantRemover::class.java)
    @Transactional
    fun removeVariant(userId: String, warehouseCode: String?, locationVariantUpdate: LocationVariantUpdate, removalMode: RemovalMode) {
        val currentWarehouseCode = warehouseResolver.getCurrentWarehouseCode(userId, warehouseCode)
        val locationOption = if (currentWarehouseCode == null) {
            locationRepository.findById(locationVariantUpdate.locationId)
        } else {
            locationRepository.findByIdAndWarehouseCode(locationVariantUpdate.locationId, currentWarehouseCode)
        }
        val location = locationOption.orElseThrow { LocationNotFoundException("location not found", locationVariantUpdate.locationId, currentWarehouseCode) }
        val variant = LocationVariant(variantId = locationVariantUpdate.variantId, quantity = locationVariantUpdate.quantity)
        location.removeVariant(variant, removalMode)
        locationRepository.save(location)
        log.info(
            "Variant reduced from a location ",
            StructuredArguments.keyValue("variantId", locationVariantUpdate.variantId),
            StructuredArguments.keyValue("locationId", locationVariantUpdate.locationId),
            StructuredArguments.keyValue("quantity", locationVariantUpdate.quantity)
        )
        logRemove(userId, location.barcode, locationVariantUpdate)
    }
    private fun logRemove(pickerId: String, locationBarCode: String, locationVariantUpdate: LocationVariantUpdate) {
        userActionPublisher.publish(
            VariantRemoved(
                userId = pickerId,
                variantId = locationVariantUpdate.variantId,
                locationId = locationVariantUpdate.locationId,
                locationBarCode = locationBarCode,
                quantity = locationVariantUpdate.quantity,
            )
        )
    }
}