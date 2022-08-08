package com.taager.travolta.shipment.command.application.usecases
import com.taager.travolta.sharedkernel.domain.models.UserId
import com.taager.travolta.shipment.command.application.exceptions.ShipmentNotFoundByTrackingIdException
import com.taager.travolta.shipment.command.domain.contracts.ShipmentRepo
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
@Service
class ShipmentScannedReadyToShip(private val shipmentRepo: ShipmentRepo) {
    private val logger = LoggerFactory.getLogger(ShipmentScannedReadyToShip::class.java)
    fun execute(request: ShipmentScannedReadyToShipRequest) {
        val shipment = getShipmentIfExist(request.trackingId)
        shipment.readyToShip(request.userId)
        shipmentRepo.saveByTrackingId(shipment)
        logger.debug("Shipment with tracking id [${request.trackingId}] is ready to shipped out")
    }
    private fun getShipmentIfExist(trackingId: TrackingId) =
        shipmentRepo.getByTrackingId(trackingId).orElseThrow { ShipmentNotFoundByTrackingIdException(trackingId) }
}
data class ShipmentScannedReadyToShipRequest(val trackingId: TrackingId, val userId: UserId)
