package com.taager.travolta.picklist.query.application.exceptions
import com.taager.travolta.sharedkernel.domain.exceptions.WmsException
class PickerDoesNotHavePicklistAssignedException(pickerId: String) : WmsException("Picker with id [$pickerId] does not have picklist assigned")
class PicklistCannotBeAccessedFromDiffWarehouseException(id: String, picklistWarehouseCode: String, requestWarehouseCode: String) :
    WmsException("Picklist with id [$id] is belonging to warehouse [$picklistWarehouseCode] cannot be accessed from [$requestWarehouseCode]")