package com.taager.travolta.picklist.command.application.usecases
import com.taager.travolta.picklist.command.domain.contracts.PicklistRepo
import com.taager.travolta.picklist.command.domain.exceptions.PicklistNotFoundByIdException
import com.taager.travolta.picklist.command.domain.models.picklist.ItemId
import com.taager.travolta.picklist.command.domain.models.picklist.PickerId
import com.taager.travolta.picklist.command.domain.models.picklist.PicklistId
import com.taager.travolta.sharedkernel.domain.models.WarehouseCode
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
@Service
class MarkPicklistItemNotFound(private val picklistRepo: PicklistRepo) {
    private val logger = LoggerFactory.getLogger(MarkPicklistItemNotFound::class.java)
    fun execute(request: MarkPicklistItemNotFoundRequest) {
        val picklist = getPicklistIfExist(request.picklistId)
        picklist.markItemAsNotFound(request.itemId, request.pickerId, request.warehouseCode)
        picklistRepo.save(picklist)
        logger.debug("Picklist item [${request.itemId}] is marked as not found ")
    }
    private fun getPicklistIfExist(id: PicklistId) = picklistRepo.getById(id).orElseThrow { PicklistNotFoundByIdException(id) }
}
data class MarkPicklistItemNotFoundRequest(
    val picklistId: PicklistId,
    val itemId: ItemId,
    val pickerId: PickerId,
    val warehouseCode: WarehouseCode
)
