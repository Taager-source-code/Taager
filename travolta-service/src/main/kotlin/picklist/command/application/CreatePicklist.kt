package com.taager.travolta.picklist.command.application.usecases
import com.taager.travolta.picklist.command.domain.contracts.PicklistRepo
import com.taager.travolta.picklist.command.domain.exceptions.PicklistNameAlreadyExistingException
import com.taager.travolta.picklist.command.domain.models.picklist.Picklist
import com.taager.travolta.picklist.command.domain.models.picklist.PicklistId
import com.taager.travolta.picklist.command.domain.models.picklist.PicklistItemRequest
import com.taager.travolta.picklist.command.domain.models.picklist.PicklistName
import com.taager.travolta.sharedkernel.domain.models.WarehouseCode
import org.springframework.stereotype.Service
@Service
class CreatePicklist(val picklistRepo: PicklistRepo) {
    fun execute(picklistName: PicklistName, picklistCreationRequest: List<PicklistItemRequest>, warehouseCode: WarehouseCode): PicklistId {
        if(picklistExistingByName(picklistName)) throw PicklistNameAlreadyExistingException()
        val picklist = Picklist.new(picklistName, picklistCreationRequest, warehouseCode)
        picklistRepo.save(picklist)
        return picklist.picklistId
    }
    private fun picklistExistingByName(picklistName: PicklistName) = picklistRepo.existsByName(picklistName)
}
