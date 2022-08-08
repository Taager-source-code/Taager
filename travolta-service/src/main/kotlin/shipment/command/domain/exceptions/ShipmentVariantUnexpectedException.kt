package com.taager.travolta.shipment.command.domain.exceptions
import com.taager.travolta.sharedkernel.domain.exceptions.WmsException
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
import com.taager.travolta.shipment.command.domain.models.shipment.VariantId
class ShipmentVariantUnexpectedException(
    val trackingId: TrackingId,
    private val variantsIds: List<VariantId>,
): WmsException("Variants [$variantsIds] are unexpected in shipment [$trackingId]")