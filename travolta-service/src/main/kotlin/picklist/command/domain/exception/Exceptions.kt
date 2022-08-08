package com.taager.travolta.picklist.command.domain.exceptions
import com.taager.travolta.picklist.command.domain.models.picklist.*
import com.taager.travolta.picklist.common.domain.models.PicklistStatus
import com.taager.travolta.sharedkernel.domain.exceptions.InvalidInputException
import com.taager.travolta.sharedkernel.domain.exceptions.WmsException
import com.taager.travolta.sharedkernel.domain.models.WarehouseCode
class InvalidQuantityException(invalidValue: Quantity) :
    InvalidInputException("Invalid quantity value [$invalidValue]")
class IllegalPicklistStatusTransitionException(val currentStatus: PicklistStatus, targetStatus: PicklistStatus, lastUpdatedAt: AssignedAt?) :
    WmsException("Not allowed to move picklist from [$currentStatus] to [$targetStatus], last updated at [$lastUpdatedAt]")
class PicklistIsAlreadyAssignedException(picklistId: PicklistId, pickerId: PickerId) :
    WmsException("Picklist [$picklistId] is already assigned to picker [$pickerId]")
class PicklistIsAlreadyUnAssignedException(picklistId: PicklistId) :
    WmsException("Picklist [$picklistId] is already un-assigned assigned")
class PicklistIsAssignedToAnotherPickerException(picklistId: PicklistId, pickerId: PickerId) :
    WmsException("Picklist [$picklistId] is not assigned to the picker [$pickerId]")
class PicklistIsEmptyException : WmsException("Picklist does not have any items to pick")
class MissingPicklistNameException : WmsException("Picklist name is missing")
class PicklistNameAlreadyExistingException : WmsException("Picklist with same name already existing")
class PicklistNotFoundByIdException(id: PicklistId) : WmsException("Picklist with id [$id] is not found")
class PicklistItemNotFoundByIdException(id: ItemId) : WmsException("Picklist with item id [$id] is not found")
class PickedQuantityIsMoreThanItemQuantityException(id: PicklistId, itemId: ItemId, pickedQuantity: Quantity, requestedQuantity: Quantity) :
    WmsException("The picked quantity for item id [$itemId] in picklist [$id] is [$pickedQuantity] more than requested item quantity [$requestedQuantity]")
class ItemAlreadyPickedException(id: PicklistId, itemId: ItemId) :
    WmsException("The item id [$itemId] in picklist [$id] is already picked")
class PickerAlreadyHasPicklistAssignedException(pickerId: PickerId) : WmsException("Picker with id [$pickerId] already has picklist assigned")
class PicklistCannotBeModifiedFromDiffWarehouseException(id: PicklistId, picklistWarehouseCode: WarehouseCode, requestWarehouseCode: WarehouseCode) :
    WmsException("Picklist with id [$id] is belonging to warehouse [$picklistWarehouseCode] cannot be modified from [$requestWarehouseCode]")
