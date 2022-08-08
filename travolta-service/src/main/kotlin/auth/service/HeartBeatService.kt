package com.taager.travolta.auth.service
import com.taager.travolta.auth.domain.HeartBeat
import com.taager.travolta.auth.repository.HeartbeatRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import net.logstash.logback.argument.StructuredArguments.keyValue
@Service
class HeartBeatService(private val heartbeatRepository: HeartbeatRepository) {
    private val log = LoggerFactory.getLogger(HeartBeatService::class.java)
    @Transactional
    fun markHeartbeat(userId: String) {
        val heartBeat = heartbeatRepository.findByUserId(userId)
        if (heartBeat != null) {
            heartbeatRepository.delete(heartBeat)
        }
        val newHeartBeat = HeartBeat(userId = userId)
        heartbeatRepository.save(newHeartBeat)
        log.debug("Heartbeat event received from user=$userId", keyValue("userName",userId))
    }
    fun getLiveHeartbeats(userIds: List<String>, timestamp: Long): List<HeartBeat> {
        return heartbeatRepository.findByUserIdInAndUpdatedAtAfter(userIds, timestamp)
    }
}
