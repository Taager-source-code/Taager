package com.taager.wallet.sharedkernel.infrastructure.db
import io.r2dbc.spi.Connection
import io.r2dbc.spi.ConnectionFactory
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.runBlocking
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.stereotype.Component
/*
    Reactive driver doesn't seem to be validating database connection on startup.
    This class runs on startup and checks health of connection factory.
 */
@Component
class DatabaseHealthCheck(private val factory: ConnectionFactory) : ApplicationRunner {
    private val logger: Logger = LoggerFactory.getLogger(DatabaseHealthCheck::class.java)
    override fun run(args: ApplicationArguments) {
        runBlocking {
            var connection : Connection? = null
            try {
                connection = factory.create().awaitFirstOrNull()
                logger.info("Database health check passed")
            } finally {
                connection?.close()
            }
        }
    }
}
