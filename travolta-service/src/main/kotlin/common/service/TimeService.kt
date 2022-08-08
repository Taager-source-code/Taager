package com.taager.travolta.common.service
import org.springframework.stereotype.Component
@Component
class TimeService {
    fun currentTimestamp() : Long {
        return System.currentTimeMillis()
    }
}
