package com.taager.travolta.shipment.command.domain.contracts
import com.taager.travolta.shipment.command.domain.models.shipment.Shipment
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
import java.util.*
abstract class ShipmentRepo {
    abstract fun getByTrackingId(trackingId: TrackingId): Optional<Shipment>
    abstract fun existsByTrackingId(trackingId: TrackingId): Boolean
    abstract fun saveByTrackingId(shipment: Shipment)
    abstract fun deleteByTrackingId(trackingId: TrackingId)
}