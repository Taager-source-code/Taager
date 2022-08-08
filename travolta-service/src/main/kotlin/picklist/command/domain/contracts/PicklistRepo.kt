package com.taager.travolta.picklist.command.domain.contracts
import com.taager.travolta.picklist.command.domain.models.picklist.PickerId
import com.taager.travolta.picklist.command.domain.models.picklist.Picklist
import com.taager.travolta.picklist.command.domain.models.picklist.PicklistId
import com.taager.travolta.picklist.command.domain.models.picklist.PicklistName
import java.util.*
abstract class PicklistRepo {
    abstract fun save(picklist: Picklist)
    abstract fun existsByName(picklistName: PicklistName): Boolean
    abstract fun getById(picklistId: PicklistId): Optional<Picklist>
    abstract fun getByAssignedPickerId(assignedPickerId: PickerId): Optional<Picklist>
}