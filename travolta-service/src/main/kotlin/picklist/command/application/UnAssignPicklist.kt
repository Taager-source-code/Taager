package com.taager.travolta.picklist.command.application.usecases
import com.taager.travolta.picklist.command.domain.contracts.PicklistRepo
import com.taager.travolta.picklist.command.domain.exceptions.PicklistNotFoundByIdException
import com.taager.travolta.picklist.command.domain.models.picklist.PicklistId
import com.taager.travolta.sharedkernel.domain.models.WarehouseCode
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
@Service
class UnAssignPicklist(private val picklistRepo: PicklistRepo) {
    private val logger = LoggerFactory.getLogger(AssignPicklist::class.java)
    fun execute(unAssignPicklistRequest: UnAssignPicklistRequest) {
        val picklist = getPicklistIfExist(unAssignPicklistRequest.picklistId)
        picklist.unAssign(unAssignPicklistRequest.warehouseCode)
        picklistRepo.save(picklist)
        logger.debug("Picklist with id [${unAssignPicklistRequest.picklistId}] is un assigned")
    }
    private fun getPicklistIfExist(id: PicklistId) =
        picklistRepo.getById(id).orElseThrow { PicklistNotFoundByIdException(id) }
}
data class UnAssignPicklistRequest(
    val picklistId: PicklistId,
    val warehouseCode: WarehouseCode
)
