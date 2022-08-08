package com.taager.travolta.shipment.common.infrastructure.converters
import com.taager.travolta.openapi.model.ShipmentStatusDto
import com.taager.travolta.shipment.common.domain.models.ShipmentStatus
fun shipmentStatusDomainToDto(status: ShipmentStatus): ShipmentStatusDto =
    when (status) {
        ShipmentStatus.CREATED -> ShipmentStatusDto.created
        ShipmentStatus.READY_TO_SHIP -> ShipmentStatusDto.readyToShip
        ShipmentStatus.SHIPPED_OUT -> ShipmentStatusDto.shippedOut
        ShipmentStatus.RETURNED -> ShipmentStatusDto.returned
        ShipmentStatus.DELAYED -> ShipmentStatusDto.delayed
        ShipmentStatus.RETURNED_QC_CHECKED -> ShipmentStatusDto.returnQcChecked
    }
