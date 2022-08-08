package com.taager.travolta.common.reporting.useractions.log
import com.taager.travolta.common.reporting.useractions.UserActionPublisher
import com.taager.travolta.common.reporting.useractions.domain.UserAction
import com.taager.travolta.common.reporting.useractions.kinesis.KinesisUserActionPublisher
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.stereotype.Service
@Service
@ConditionalOnMissingBean(KinesisUserActionPublisher::class)
class LogUserActionPublisher : UserActionPublisher {
    private val log = LoggerFactory.getLogger(LogUserActionPublisher::class.java)
    override fun publish(userAction: UserAction) {
        log.info("User action sent to log: $userAction")
    }
}
