package com.taager.travolta.shipment.command.domain.exceptions
import com.taager.travolta.sharedkernel.domain.exceptions.WmsException
import com.taager.travolta.shipment.command.domain.models.shipment.Quantity
import com.taager.travolta.shipment.command.domain.models.shipment.TrackingId
import com.taager.travolta.shipment.command.domain.models.shipment.VariantId
class VariantQuantityMismatchException(
    val trackingId: TrackingId,
    val variantId: VariantId,
    val mismatchedQuantity: Quantity
    ): WmsException("Variant [$variantId] has mismatched quantity [$mismatchedQuantity] to what expected in shipment [$trackingId]")