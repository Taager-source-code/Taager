package com.taager.travolta.shipment.command.domain.exceptions
import com.taager.travolta.sharedkernel.domain.exceptions.WmsException
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
import com.taager.travolta.shipment.command.domain.models.shipment.VariantId
class ShipmentVariantMissingException(
val trackingId: TrackingId,
val variantId: VariantId,
): WmsException("Variant [$variantId] return qc results are missing while it's expected in shipment [$trackingId]")