package com.taager.travolta.shipment.command.domain.models.shipment
enum class ReturnQCStatus(val value: String) {
    SUCCESSFUL("SUCCESSFUL"),
    DAMAGED("DAMAGED"),
    PARTIALLY_DAMAGED("PARTIALLY_DAMAGED"),
    MISSING("MISSING")
}
