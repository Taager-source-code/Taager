package com.taager.travolta.picklist.common.infrastructure.controllers
import com.fasterxml.jackson.module.kotlin.MissingKotlinParameterException
import com.taager.travolta.auth.domain.WarehousePrivileges
import com.taager.travolta.common.security.UserHelper
import com.taager.travolta.common.usermanagement.RequiredPrivilege
import com.taager.travolta.location.service.InsufficientQuantityOnLocationException
import com.taager.travolta.location.service.LocationNotFoundException
import com.taager.travolta.openapi.api.PickListsApi
import com.taager.travolta.openapi.model.*
import com.taager.travolta.picklist.command.application.usecases.*
import com.taager.travolta.picklist.command.domain.exceptions.*
import com.taager.travolta.picklist.command.domain.models.picklist.*
import com.taager.travolta.picklist.command.domain.services.PicklistItemPickingRequest
import com.taager.travolta.picklist.common.infrastructure.controllers.converters.PicklistDomainToControllerConverter
import com.taager.travolta.picklist.common.infrastructure.controllers.converters.picklistStatusDomainToDto
import com.taager.travolta.picklist.query.application.exceptions.PickerDoesNotHavePicklistAssignedException
import com.taager.travolta.picklist.query.application.exceptions.PicklistCannotBeAccessedFromDiffWarehouseException
import com.taager.travolta.picklist.query.application.usecases.GetAssignedPendingPicklist
import com.taager.travolta.picklist.query.application.usecases.GettingAssignedPendingPicklistRequest
import com.taager.travolta.sharedkernel.domain.models.LocationBarCode
import com.taager.travolta.sharedkernel.domain.models.WarehouseCode
import com.taager.travolta.variant.service.VariantNotFoundException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.util.*
@RestController
class PicklistsController(
    val createPicklist: CreatePicklist,
    val assignPicklist: AssignPicklist,
    val unAssignPicklist: UnAssignPicklist,
    val pickPicklistItem: PickPicklistItem,
    val markPicklistItemNotFound: MarkPicklistItemNotFound,
    val getAssignedPendingPicklist: GetAssignedPendingPicklist,
    val picklistDomainToControllerConverter: PicklistDomainToControllerConverter
) : PickListsApi {
    @RequiredPrivilege(oneOf = [WarehousePrivileges.CREATE_PICKLIST])
    override fun createPicklist(picklistCreationDto: PicklistCreationDto): ResponseEntity<Any> {
        val userSession = UserHelper.getCurrentSession()
        val picklistItems = picklistCreationDto.items.map { PicklistItemRequest(it.variantId, it.quantity) }
        val picklistId = createPicklist.execute(PicklistName(picklistCreationDto.name), picklistItems, WarehouseCode(userSession.warehouseCode ?: ""))
        return ResponseEntity(PicklistCreationResponseDto(picklistId.value), HttpStatus.OK)
    }
    @RequiredPrivilege(oneOf = [WarehousePrivileges.ASSIGN_PICKLIST])
    override fun assignPicklist(id: String): ResponseEntity<Unit> {
        val userSession = UserHelper.getCurrentSession()
        val request = AssignPicklistRequest(
            picklistId = PicklistId(UUID.fromString(id)),
            pickerId = PickerId(userSession.user.id),
            warehouseCode = WarehouseCode(userSession.warehouseCode ?: "")
        )
        assignPicklist.execute(request)
        return ResponseEntity(HttpStatus.OK)
    }
    @RequiredPrivilege(oneOf = [WarehousePrivileges.UN_ASSIGN_PICKLIST])
    override fun unassignPicklist(id: String): ResponseEntity<Unit> {
        val userSession = UserHelper.getCurrentSession()
        val request = UnAssignPicklistRequest(
            picklistId = PicklistId(UUID.fromString(id)),
            warehouseCode = WarehouseCode(userSession.warehouseCode ?: "")
        )
        unAssignPicklist.execute(request)
        return ResponseEntity(HttpStatus.OK)
    }
    @RequiredPrivilege(oneOf = [WarehousePrivileges.UPDATE_PICKLIST_ITEM])
    override fun pickPicklistItem(id: String, itemId: String, pickablePicklistItemDto: PickablePicklistItemDto): ResponseEntity<Unit> {
        val userSession = UserHelper.getCurrentSession()
        val request = PicklistItemPickingRequest(
            picklistId = PicklistId.of(id),
            itemId = ItemId.of(itemId),
            pickerId = PickerId(userSession.user.id),
            locationBarCode = LocationBarCode(pickablePicklistItemDto.location),
            quantity = Quantity(pickablePicklistItemDto.quantity),
            warehouseCode = WarehouseCode(userSession.warehouseCode ?: "")
        )
        pickPicklistItem.execute(request)
        return ResponseEntity(HttpStatus.OK)
    }
    @RequiredPrivilege(oneOf = [WarehousePrivileges.UPDATE_PICKLIST_ITEM])
    override fun getAssignedPendingPicklist(): ResponseEntity<Any> {
        val userSession = UserHelper.getCurrentSession()
        val request = GettingAssignedPendingPicklistRequest(
            pickerId = userSession.user.id,
            warehouseCode = userSession.warehouseCode ?: ""
        )
        val response = getAssignedPendingPicklist.execute(request, userSession)
        return ResponseEntity(
            picklistDomainToControllerConverter.convert(response),
            HttpStatus.OK
        )
    }
    @RequiredPrivilege(oneOf = [WarehousePrivileges.UPDATE_PICKLIST_ITEM])
    override fun markPicklistItemNotFound(id: String, itemId: String): ResponseEntity<Unit> {
        val userSession = UserHelper.getCurrentSession()
        val request = MarkPicklistItemNotFoundRequest(
            picklistId = PicklistId.of(id),
            itemId = ItemId.of(itemId),
            pickerId = PickerId(userSession.user.id),
            warehouseCode = WarehouseCode(userSession.warehouseCode ?: "")
        )
        markPicklistItemNotFound.execute(request)
        return ResponseEntity(HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [PicklistsController::class])
class PicklistsControllerAdvice {
    private val log = LoggerFactory.getLogger(PicklistsControllerAdvice::class.java)
    @ExceptionHandler(InvalidQuantityException::class)
    fun invalidPicklistItemQuantity(ex: InvalidQuantityException): ResponseEntity<PickingPicklistItemBadRequestErrorDto> {
        log.warn("invalid picklist item quantity,", ex)
        return ResponseEntity(
            PickingPicklistItemBadRequestErrorDto(code = PickingPicklistItemBadRequestErrorDto.Code.quantityIsLessOrEqualZero, error = ex.message ?: ""),
            HttpStatus.BAD_REQUEST
        )
    }
    @ExceptionHandler(PicklistIsEmptyException::class)
    fun emptyPicklistItems(ex: PicklistIsEmptyException): ResponseEntity<PickingPicklistItemBadRequestErrorDto> {
        log.warn("picklist items are empty,", ex)
        return ResponseEntity(
            PickingPicklistItemBadRequestErrorDto(code = PickingPicklistItemBadRequestErrorDto.Code.missingOrEmptyMandatoryField, error = "items"),
            HttpStatus.BAD_REQUEST
        )
    }
    @ExceptionHandler(MissingKotlinParameterException::class)
    fun missingBodyKey(ex: MissingKotlinParameterException): ResponseEntity<PickingPicklistItemBadRequestErrorDto> {
        log.warn("picklist required field is missing [${ex.parameter.name}]", ex)
        return ResponseEntity(
            PickingPicklistItemBadRequestErrorDto(
                code = PickingPicklistItemBadRequestErrorDto.Code.missingOrEmptyMandatoryField,
                error = ex.parameter.name ?: ""
            ),
            HttpStatus.BAD_REQUEST
        )
    }
    @ExceptionHandler(MissingPicklistNameException::class)
    fun missingBodyKey(ex: MissingPicklistNameException): ResponseEntity<PickingPicklistItemBadRequestErrorDto> {
        log.warn("picklist required field is missing [name]", ex)
        return ResponseEntity(
            PickingPicklistItemBadRequestErrorDto(code = PickingPicklistItemBadRequestErrorDto.Code.missingOrEmptyMandatoryField, error = "name"),
            HttpStatus.BAD_REQUEST
        )
    }
    @ExceptionHandler(PicklistNameAlreadyExistingException::class)
    fun duplicatePicklistName(ex: PicklistNameAlreadyExistingException): ResponseEntity<PicklistCreationConflictErrorDto> {
        log.warn("Picklist already exists by name,", ex)
        return ResponseEntity(
            PicklistCreationConflictErrorDto(code = PicklistCreationConflictErrorDto.Code.picklistAlreadyExistsWithSameName, error = ex.message ?: ""),
            HttpStatus.CONFLICT
        )
    }
    @ExceptionHandler(PicklistIsAlreadyAssignedException::class)
    fun alreadyAssignedPicklist(ex: PicklistIsAlreadyAssignedException): ResponseEntity<PicklistAssignmentConflictErrorDto> {
        log.warn("Picklist already un-assigned", ex)
        return ResponseEntity(
            PicklistAssignmentConflictErrorDto(code = PicklistAssignmentConflictErrorDto.Code.picklistAlreadyAssigned, error = "Picklist is already assigned"),
            HttpStatus.CONFLICT
        )
    }
    @ExceptionHandler(PicklistIsAlreadyUnAssignedException::class)
    fun alreadyAssignedPicklist(ex: PicklistIsAlreadyUnAssignedException): ResponseEntity<PicklistUnAssignmentConflictErrorDto> {
        log.warn("Picklist already assigned", ex)
        return ResponseEntity(
            PicklistUnAssignmentConflictErrorDto(code = PicklistUnAssignmentConflictErrorDto.Code.picklistAlreadyUnAssigned, error = "Picklist is already un-assigned"),
            HttpStatus.CONFLICT
        )
    }
    @ExceptionHandler(PickerAlreadyHasPicklistAssignedException::class)
    fun pickerAlreadyHasPicklistAssigned(ex: PickerAlreadyHasPicklistAssignedException): ResponseEntity<PicklistAssignmentConflictErrorDto> {
        log.warn("Picker already has picklist assigned", ex)
        return ResponseEntity(
            PicklistAssignmentConflictErrorDto(
                code = PicklistAssignmentConflictErrorDto.Code.pickerAlreadyHasPicklistAssigned,
                error = "Picker already has picklist assigned"
            ),
            HttpStatus.CONFLICT
        )
    }
    @ExceptionHandler(ItemAlreadyPickedException::class)
    fun itemAlreadyPicked(ex: ItemAlreadyPickedException): ResponseEntity<PickingPicklistItemConflictErrorDto> {
        log.warn("Item already picked,", ex)
        return ResponseEntity(
            PickingPicklistItemConflictErrorDto(code = PickingPicklistItemConflictErrorDto.Code.itemAlreadyPicked, error = ex.message ?: ""),
            HttpStatus.CONFLICT
        )
    }
    @ExceptionHandler(PickedQuantityIsMoreThanItemQuantityException::class)
    fun pickedQuantityHigherThanRequested(ex: PickedQuantityIsMoreThanItemQuantityException): ResponseEntity<PickingPicklistItemBadRequestErrorDto> {
        log.warn("Picked quantity is higher than requested in pick list item,", ex)
        return ResponseEntity(
            PickingPicklistItemBadRequestErrorDto(code = PickingPicklistItemBadRequestErrorDto.Code.pickedQuantityIsHigherThanItemQuantity, error = ex.message ?: ""),
            HttpStatus.BAD_REQUEST
        )
    }
    @ExceptionHandler(IllegalPicklistStatusTransitionException::class)
    fun illegalTransitionPicklist(ex: IllegalPicklistStatusTransitionException): ResponseEntity<PickingPicklistItemConflictErrorDto> {
        log.warn("Illegal picklist status transition", ex)
        return ResponseEntity(
            PickingPicklistItemConflictErrorDto(
                code = PickingPicklistItemConflictErrorDto.Code.illegalTransition,
                error = ex.message ?: "",
                picklistStatus = picklistStatusDomainToDto(ex.currentStatus)
            ),
            HttpStatus.CONFLICT
        )
    }
    @ExceptionHandler(VariantNotFoundException::class)
    fun variantDoesNotExist(ex: VariantNotFoundException): ResponseEntity<PickingPicklistItemConflictErrorDto> {
        log.warn("Picked variant not found on location", ex)
        return ResponseEntity(
            PickingPicklistItemConflictErrorDto(code = PickingPicklistItemConflictErrorDto.Code.variantIsNotExistentOnLocation, error = ex.message ?: ""),
            HttpStatus.CONFLICT
        )
    }
    @ExceptionHandler(InsufficientQuantityOnLocationException::class)
    fun insufficientQuantity(ex: InsufficientQuantityOnLocationException): ResponseEntity<PickingPicklistItemConflictErrorDto> {
        log.warn("Insufficient quantity on location", ex)
        return ResponseEntity(
            PickingPicklistItemConflictErrorDto(code = PickingPicklistItemConflictErrorDto.Code.insufficientQuantityOnLocation, error = ex.message ?: ""),
            HttpStatus.CONFLICT
        )
    }
    @ExceptionHandler(LocationNotFoundException::class)
    fun locationNotFound(ex: LocationNotFoundException): ResponseEntity<PickingPicklistItemBadRequestErrorDto> {
        log.warn("Picked location not found,", ex)
        return ResponseEntity(
            PickingPicklistItemBadRequestErrorDto(code = PickingPicklistItemBadRequestErrorDto.Code.locationNotFound, error = ex.message ?: ""),
            HttpStatus.BAD_REQUEST
        )
    }
    @ExceptionHandler(PicklistNotFoundByIdException::class)
    fun notFoundPicklist(ex: PicklistNotFoundByIdException): ResponseEntity<PickingPicklistItemNotFoundErrorDto> {
        log.warn("Picklist is not found,", ex)
        return ResponseEntity(
            PickingPicklistItemNotFoundErrorDto(code = PickingPicklistItemNotFoundErrorDto.Code.picklistNotFound, error = ex.message ?: ""),
            HttpStatus.NOT_FOUND
        )
    }
    @ExceptionHandler(PicklistItemNotFoundByIdException::class)
    fun notFoundItem(ex: PicklistItemNotFoundByIdException): ResponseEntity<PickingPicklistItemNotFoundErrorDto> {
        log.warn("Can't find picklist item,", ex)
        return ResponseEntity(
            PickingPicklistItemNotFoundErrorDto(code = PickingPicklistItemNotFoundErrorDto.Code.itemNotFound, error = ex.message ?: ""),
            HttpStatus.NOT_FOUND
        )
    }
    @ExceptionHandler(PicklistCannotBeModifiedFromDiffWarehouseException::class)
    fun notAllowedToAccessFromDiffWarehouse(ex: PicklistCannotBeModifiedFromDiffWarehouseException): ResponseEntity<PicklistForbiddenActionErrorDto> {
        log.warn("Can not modified the picklist from another warehouse, ", ex)
        return ResponseEntity(
            PicklistForbiddenActionErrorDto(code = PicklistForbiddenActionErrorDto.Code.warehouse, error = ex.message ?: ""),
            HttpStatus.FORBIDDEN
        )
    }
    @ExceptionHandler(PicklistCannotBeAccessedFromDiffWarehouseException::class)
    fun notAllowedToAccessFromDiffWarehouse(ex: PicklistCannotBeAccessedFromDiffWarehouseException): ResponseEntity<PicklistForbiddenActionErrorDto> {
        log.warn("Can not access the picklist from another warehouse, ", ex)
        return ResponseEntity(
            PicklistForbiddenActionErrorDto(code = PicklistForbiddenActionErrorDto.Code.warehouse, error = ex.message ?: ""),
            HttpStatus.FORBIDDEN
        )
    }
    @ExceptionHandler(PicklistIsAssignedToAnotherPickerException::class)
    fun notAllowedToModifyFromDiffPicker(ex: PicklistIsAssignedToAnotherPickerException): ResponseEntity<PicklistForbiddenActionErrorDto> {
        log.warn("Can not modify the picklist from another picker, ", ex)
        return ResponseEntity(
            PicklistForbiddenActionErrorDto(code = PicklistForbiddenActionErrorDto.Code.picker, error = ex.message ?: ""),
            HttpStatus.FORBIDDEN
        )
    }
    @ExceptionHandler(PickerDoesNotHavePicklistAssignedException::class)
    fun pickerDoesNotHavePicklistAssigned(ex: PickerDoesNotHavePicklistAssignedException): ResponseEntity<PicklistGettingAssignedPendingConflictErrorDto> {
        log.warn("Picker does not have picklist assigned,", ex)
        return ResponseEntity(
            PicklistGettingAssignedPendingConflictErrorDto(
                code = PicklistGettingAssignedPendingConflictErrorDto.Code.pickerDoesNotHavePicklistAssigned,
                error = ex.message ?: ""
            ),
            HttpStatus.CONFLICT
        )
    }
}
data class PicklistCreationResponseDto(val id: UUID)
data class GettingAssignedPendingPicklistResponseDto(val id: String, val name: String, val items: List<AssignedPicklistItemDto>)
