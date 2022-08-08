package com.taager.travolta.picklist.query.infrastructure.repositories.db.access
import com.taager.travolta.picklist.common.infrastructure.repositories.db.PicklistDbo
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.util.*
@Repository
class PicklistQueryDao(
    val pickListInternalDao: PickListInternalReadDao
) {
    fun findByAssignedPickerId(assignedPickerId: String): Optional<PicklistDbo> =
        pickListInternalDao.findByAssignedPickerId(assignedPickerId = assignedPickerId)
}
@Repository
interface PickListInternalReadDao : MongoRepository<PicklistDbo, String> {
    fun findByAssignedPickerId(assignedPickerId: String): Optional<PicklistDbo>
}
