package com.taager.travolta.shipment.command.application.usecases
import com.taager.travolta.sharedkernel.domain.models.UserId
import com.taager.travolta.shipment.command.application.exceptions.ShipmentNotFoundByTrackingIdException
import com.taager.travolta.shipment.command.domain.contracts.ShipmentRepo
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
@Service
class ShipmentScannedDelayed(private val shipmentRepo: ShipmentRepo) {
    private val logger = LoggerFactory.getLogger(ShipmentScannedDelayed::class.java)
    fun execute(request: ShipmentScannedDelayedRequest) {
        val shipment = getShipmentIfExist(request.trackingId)
        shipment.delayed(request.userId)
        shipmentRepo.saveByTrackingId(shipment)
        logger.debug("Shipment with tracking id [${request.trackingId}] is delayed")
    }
    private fun getShipmentIfExist(trackingId: TrackingId) =
        shipmentRepo.getByTrackingId(trackingId).orElseThrow { ShipmentNotFoundByTrackingIdException(trackingId) }
}
data class ShipmentScannedDelayedRequest(val trackingId: TrackingId, val userId: UserId)
