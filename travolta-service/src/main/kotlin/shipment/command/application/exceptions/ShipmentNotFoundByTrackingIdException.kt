package com.taager.travolta.shipment.command.application.exceptions
import com.taager.travolta.sharedkernel.domain.exceptions.WmsException
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
class ShipmentNotFoundByTrackingIdException(val trackingId: TrackingId) :
    WmsException("Shipment with tracking id[$trackingId] doesn't exist")
