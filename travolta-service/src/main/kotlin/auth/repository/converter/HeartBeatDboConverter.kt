package com.taager.travolta.auth.repository.converter
import com.taager.travolta.auth.domain.HeartBeat
import com.taager.travolta.auth.repository.dbo.HeartBeatDbo
import org.springframework.stereotype.Component
@Component
class HeartBeatDboConverter {
    fun convert(heartBeat: HeartBeat) : HeartBeatDbo {
        return HeartBeatDbo(
            id = heartBeat.id,
            userId = heartBeat.userId,
            updatedAt = heartBeat.updatedAt
        )
    }
    fun convert(heartBeatDbo: HeartBeatDbo) : HeartBeat {
        return HeartBeat(
            id = heartBeatDbo.id,
            userId = heartBeatDbo.userId,
            updatedAt = heartBeatDbo.updatedAt
        )
    }
}
