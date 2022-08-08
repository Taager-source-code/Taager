package com.taager.travolta.shipment.command.application.usecases
import com.taager.travolta.sharedkernel.domain.models.UserId
import com.taager.travolta.shipment.command.application.exceptions.ShipmentNotFoundByTrackingIdException
import com.taager.travolta.shipment.command.domain.contracts.ShipmentRepo
import com.taager.travolta.shipment.command.domain.models.shipment.ReturnedOrderLine
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
import com.taager.travolta.shipment.command.domain.services.ShipmentReturnQCService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
@Service
class ShipmentScannedReturnQCChecked(private val shipmentRepo: ShipmentRepo, private val shipmentReturnQCService: ShipmentReturnQCService) {
    private val logger = LoggerFactory.getLogger(ShipmentScannedReturnQCChecked::class.java)
    @Transactional
    fun execute(request: ShipmentScannedReturnQCCheckedRequest) {
        val shipment = getShipmentIfExist(request.trackingId)
        shipmentReturnQCService.returnQCChecked(shipment, request)
        shipmentRepo.saveByTrackingId(shipment)
        logger.debug("Shipment with tracking id [${request.trackingId}] is checked by return QC")
    }
    private fun getShipmentIfExist(trackingId: TrackingId) =
        shipmentRepo.getByTrackingId(trackingId).orElseThrow { ShipmentNotFoundByTrackingIdException(trackingId) }
}
data class ShipmentScannedReturnQCCheckedRequest(val trackingId: TrackingId,
                                                 var returnedOrderLines: List<ReturnedOrderLine>,
                                                 val userId: UserId)
