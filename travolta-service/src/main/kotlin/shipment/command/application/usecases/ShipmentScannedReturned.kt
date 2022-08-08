package com.taager.travolta.shipment.command.application.usecases
import com.taager.travolta.sharedkernel.domain.models.UserId
import com.taager.travolta.shipment.command.application.exceptions.ShipmentNotFoundByTrackingIdException
import com.taager.travolta.shipment.command.domain.contracts.ShipmentRepo
import com.taager.travolta.shipment.command.domain.models.shipment.PackageSealed
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
@Service
class ShipmentScannedReturned(private val shipmentRepo: ShipmentRepo) {
    private val logger = LoggerFactory.getLogger(ShipmentScannedReturned::class.java)
    fun execute(request: ShipmentScannedReturnedRequest) {
        val shipment = getShipmentIfExist(request.trackingId)
        shipment.returned(request.userId, PackageSealed(request.isPackageSealed))
        shipmentRepo.saveByTrackingId(shipment)
        logger.debug("Shipment with tracking id [${request.trackingId}] is returned")
    }
    private fun getShipmentIfExist(trackingId: TrackingId) =
        shipmentRepo.getByTrackingId(trackingId).orElseThrow { ShipmentNotFoundByTrackingIdException(trackingId) }
}
data class ShipmentScannedReturnedRequest(val trackingId: TrackingId, val isPackageSealed: Boolean, val userId: UserId)
