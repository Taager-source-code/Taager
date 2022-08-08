package com.taager.travolta.shipment.command.application.models
import com.taager.travolta.sharedkernel.domain.models.Moment
import com.taager.travolta.shipment.command.domain.models.shipment.OrderId
import com.taager.travolta.shipment.command.domain.models.shipment.OrderLine
import com.taager.travolta.shipment.command.domain.models.shipment.ShippingCompany
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
data class BulkShipmentCreationRequest(
    val shippingCompany: ShippingCompany,
    val shipments: List<ShipmentCreationRequest>
)
data class ShipmentCreationRequest(
    val orderId: OrderId,
    val trackingId: TrackingId,
    val orderLines: List<OrderLine>,
    val createdAt: Moment,
)
