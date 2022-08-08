package com.taager.travolta.picklist.command.infrastructure.repositories.db.access
import com.taager.travolta.picklist.common.infrastructure.repositories.db.PicklistDbo
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.util.*
@Repository
class PicklistDao(
    val pickListInternalDao: PickListInternalDao
) {
    fun save(picklistDbo: PicklistDbo) {
        val oldPicklistOptional = findById(picklistDbo.id)
        if (oldPicklistOptional.isPresent) {
            val oldPicklist = oldPicklistOptional.get()
            pickListInternalDao.save(picklistDbo.copy(id = oldPicklist.id, createdAt = oldPicklist.createdAt, version = oldPicklist.version))
        } else {
            pickListInternalDao.save(picklistDbo)
        }
    }
    fun findById(id: String): Optional<PicklistDbo> = pickListInternalDao.findById(id)
    fun existsByName(picklistName: String) = pickListInternalDao.existsByName(picklistName)
    fun findByAssignedPickerId(assignedPickerId: String): Optional<PicklistDbo> =
        pickListInternalDao.findByAssignedPickerId(assignedPickerId = assignedPickerId)
}
@Repository
interface PickListInternalDao : MongoRepository<PicklistDbo, String> {
    fun existsByName(name: String): Boolean
    fun findByAssignedPickerId(assignedPickerId: String): Optional<PicklistDbo>
}
