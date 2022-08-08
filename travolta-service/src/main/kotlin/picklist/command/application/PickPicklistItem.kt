package com.taager.travolta.picklist.command.application.usecases
import com.taager.travolta.picklist.command.domain.contracts.PicklistRepo
import com.taager.travolta.picklist.command.domain.exceptions.PicklistNotFoundByIdException
import com.taager.travolta.picklist.command.domain.models.picklist.PicklistId
import com.taager.travolta.picklist.command.domain.services.PicklistItemPickingRequest
import com.taager.travolta.picklist.command.domain.services.PicklistPickingService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
@Service
class PickPicklistItem(private val picklistRepo: PicklistRepo, private val picklistPickingService: PicklistPickingService) {
    @Transactional
    fun execute(picklistItemPickingRequest: PicklistItemPickingRequest) {
        val picklist = getPicklistIfExist(picklistItemPickingRequest.picklistId)
        picklistPickingService.pick(picklist, picklistItemPickingRequest)
        picklistRepo.save(picklist)
    }
    private fun getPicklistIfExist(id: PicklistId) = picklistRepo.getById(id).orElseThrow { PicklistNotFoundByIdException(id) }
}
