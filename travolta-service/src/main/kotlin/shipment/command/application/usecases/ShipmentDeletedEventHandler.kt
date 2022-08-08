package com.taager.travolta.shipment.command.application.usecases
import com.taager.travolta.shipment.command.domain.contracts.ShipmentRepo
import com.taager.travolta.shipment.command.domain.models.shipment.OrderId
import com.taager.travolta.shipment.command.domain.models.shipment.ShippingCompany
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
@Service
class ShipmentDeletedEventHandler(private val shipmentRepo: ShipmentRepo) {
    private val logger = LoggerFactory.getLogger(ShipmentDeletedEventHandler::class.java)
    fun execute(event: ShipmentDeletionEvent) {
        val isExisting = shipmentRepo.existsByTrackingId(event.trackingId)
        if (isExisting){
            shipmentRepo.deleteByTrackingId(event.trackingId)
            logger.info("Shipment with tracking id [${event.trackingId}] is deleted")
        }else{
            logger.debug("Requested to delete Shipment with tracking id [${event.trackingId}] but it's not found")
        }
    }
}
data class ShipmentDeletionEvent(val orderId: OrderId,
                                 val trackingId: TrackingId,
                                 val shippingCompany: ShippingCompany
)