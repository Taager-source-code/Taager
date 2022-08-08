package com.taager.travolta.auth.repository
import com.taager.travolta.auth.domain.HeartBeat
import com.taager.travolta.auth.repository.converter.HeartBeatDboConverter
import com.taager.travolta.auth.repository.dbo.HeartBeatDbo
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
@Repository
class HeartbeatRepository(
    private val heartbeatRepositoryInternal: HeartBeatRepositoryInternal,
    private val converter: HeartBeatDboConverter
) {
    fun delete(heartBeat: HeartBeat) {
        heartbeatRepositoryInternal.delete(converter.convert(heartBeat))
    }
    fun save(heartBeat: HeartBeat) {
        heartbeatRepositoryInternal.save(converter.convert(heartBeat))
    }
    fun findByUserId(userId: String): HeartBeat? {
        val heartBeatDbo = heartbeatRepositoryInternal.findByUserId(userId)
        return if (heartBeatDbo != null) {
            converter.convert(heartBeatDbo)
        } else {
            null
        }
    }
    fun findByUserIdInAndUpdatedAtAfter(userIds: List<String>, date: Long): List<HeartBeat> {
        return heartbeatRepositoryInternal.findByUserIdInAndUpdatedAtAfter(userIds, date).map { converter.convert(it) }
    }
}
@Repository
interface HeartBeatRepositoryInternal : MongoRepository<HeartBeatDbo, String> {
    fun findByUpdatedAtBefore(date: Long): List<HeartBeatDbo>
    fun findByUserIdInAndUpdatedAtAfter(userIds: List<String>, date: Long): List<HeartBeatDbo>
    fun findByUserId(userId: String): HeartBeatDbo?
}
