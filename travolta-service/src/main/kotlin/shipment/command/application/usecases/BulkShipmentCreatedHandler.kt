package com.taager.travolta.shipment.command.application.usecases
import com.taager.travolta.shipment.command.application.models.BulkShipmentCreationRequest
import com.taager.travolta.shipment.command.domain.contracts.ShipmentRepo
import com.taager.travolta.shipment.command.domain.models.shipment.Shipment
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
@Service
class BulkShipmentCreatedHandler(private val shipmentRepo: ShipmentRepo) {
    private val logger = LoggerFactory.getLogger(BulkShipmentCreatedHandler::class.java)
    fun execute(bulkShipmentCreationRequest: BulkShipmentCreationRequest) {
        // TODO handle it with insert many
        bulkShipmentCreationRequest.shipments.forEach { shipmentCreationRequest ->
            if (shipmentNotExistingByTrackingId(shipmentCreationRequest.trackingId)) {
                val shipment = Shipment.new(
                    orderId = shipmentCreationRequest.orderId,
                    trackingId = shipmentCreationRequest.trackingId,
                    shippingCompany = bulkShipmentCreationRequest.shippingCompany,
                    orderLines = shipmentCreationRequest.orderLines,
                    createdAt = shipmentCreationRequest.createdAt
                )
                shipmentRepo.saveByTrackingId(shipment)
            } else {
                logger.warn("Shipment with tracking id [${shipmentCreationRequest.trackingId}] already exists")
            }
        }
    }
    private fun shipmentNotExistingByTrackingId(trackingId: TrackingId) = !shipmentRepo.existsByTrackingId(trackingId)
}
