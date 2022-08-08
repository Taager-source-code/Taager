package com.taager.cronservice.infrastructure.sharedkernel.application
import org.slf4j.Logger
import org.slf4j.LoggerFactory
abstract class BaseScheduleService {
    val logger: Logger = LoggerFactory.getLogger(this::class.java)
    abstract suspend fun executeHttp(url: String, authToken: String)
    abstract suspend fun executeAsyncMessage(topic: String, authToken: String)
}
