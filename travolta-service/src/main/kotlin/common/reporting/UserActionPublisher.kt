package com.taager.travolta.common.reporting.useractions
import com.taager.travolta.common.reporting.useractions.domain.UserAction
interface UserActionPublisher {
    fun publish(userAction: UserAction)
}
