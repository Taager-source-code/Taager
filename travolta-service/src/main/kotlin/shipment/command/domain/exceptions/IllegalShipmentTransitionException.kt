package com.taager.travolta.shipment.command.domain.exceptions
import com.taager.travolta.sharedkernel.domain.exceptions.WmsException
import com.taager.travolta.sharedkernel.domain.models.Moment
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
import com.taager.travolta.shipment.common.domain.models.ShipmentStatus
class IllegalShipmentTransitionException(
    val trackingId: TrackingId,
    val currentStatus: ShipmentStatus,
    targetStatus: ShipmentStatus,
    val lastStatusCreatedAt: Moment
) :
    WmsException("Not allowed to move Shipment from [$currentStatus] to [$targetStatus]")
