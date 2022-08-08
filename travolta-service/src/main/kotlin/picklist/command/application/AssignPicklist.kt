package com.taager.travolta.picklist.command.application.usecases
import com.taager.travolta.picklist.command.domain.contracts.PicklistRepo
import com.taager.travolta.picklist.command.domain.exceptions.PickerAlreadyHasPicklistAssignedException
import com.taager.travolta.picklist.command.domain.exceptions.PicklistNotFoundByIdException
import com.taager.travolta.picklist.command.domain.models.picklist.PickerId
import com.taager.travolta.picklist.command.domain.models.picklist.PicklistId
import com.taager.travolta.sharedkernel.domain.models.WarehouseCode
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
@Service
class AssignPicklist(val picklistRepo: PicklistRepo) {
    private val logger = LoggerFactory.getLogger(AssignPicklist::class.java)
    fun execute(assignPicklistRequest: AssignPicklistRequest) {
        assertPickerHasNoPicklistAssigned(assignPicklistRequest.pickerId)
        val picklist = getPicklistIfExist(assignPicklistRequest.picklistId)
        picklist.assign(assignPicklistRequest.pickerId, assignPicklistRequest.warehouseCode)
        picklistRepo.save(picklist)
        logger.debug("Picklist with id [${assignPicklistRequest.picklistId}] is assigned to picker [${assignPicklistRequest.pickerId}]")
    }
    private fun getPicklistIfExist(id: PicklistId) =
        picklistRepo.getById(id).orElseThrow { PicklistNotFoundByIdException(id) }
    private fun assertPickerHasNoPicklistAssigned(pickerId: PickerId) {
        picklistRepo.getByAssignedPickerId(assignedPickerId = pickerId).ifPresent { throw PickerAlreadyHasPicklistAssignedException(pickerId) }
    }
}
data class AssignPicklistRequest(
    val picklistId: PicklistId,
    val pickerId: PickerId,
    val warehouseCode: WarehouseCode
)
