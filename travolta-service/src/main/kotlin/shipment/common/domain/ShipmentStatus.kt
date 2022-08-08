package com.taager.travolta.shipment.common.domain.models
enum class ShipmentStatus(val value: String) {
    CREATED("CREATED"),
    READY_TO_SHIP("READY_TO_SHIP"),
    SHIPPED_OUT("SHIPPED_OUT"),
    DELAYED("DELAYED"),
    RETURNED("RETURNED"),
    RETURNED_QC_CHECKED("RETURNED_QC_CHECKED")
}
