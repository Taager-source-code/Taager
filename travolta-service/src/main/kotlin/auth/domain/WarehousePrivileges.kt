package com.taager.travolta.auth.domain
enum class WarehousePrivileges(var value: String) {
    INBOUND_PRODUCT("inboundProduct"),
    PICK_PRODUCT("pickProduct"),
    INTERNAL_TRANSFER_PRODUCT("internalTransferProduct"),
    INSPECT_PRODUCT("inspectProduct"),
    SCAN_READY_TO_SHIP("scanReadyToShip"),
    SCAN_SHIPPED_OUT("scanShippedOut"),
    SCAN_RETURNED("scanReturned"),
    SCAN_DELAYED("scanDelayed"),
    SCAN_RETURN_QC_CHECKED("scanReturnQCChecked"),
    WAREHOUSE_ALL("warehouseAll"),
    CREATE_PICKLIST("createPicklist"),
    ASSIGN_PICKLIST("assignPicklist"),
    UN_ASSIGN_PICKLIST("unAssignPicklist"),
    UPDATE_PICKLIST_ITEM("UPDATE_PICKLIST_ITEM");
}
