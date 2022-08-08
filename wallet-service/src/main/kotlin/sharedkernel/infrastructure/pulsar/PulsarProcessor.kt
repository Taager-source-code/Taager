package com.taager.wallet.sharedkernel.infrastructure.pulsar
import com.fasterxml.jackson.databind.ObjectMapper
import kotlinx.coroutines.runBlocking
import org.apache.pulsar.client.api.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import kotlin.reflect.KClass
abstract class PulsarProcessor<T : Any>(
    private val clazz: KClass<T>,
    private val pulsarTools: PulsarTools,
    private val topicUriPrefix: String,
    private val topic: String,
    private val subscriptionName: String,
    private val jsonMapper: ObjectMapper
) : MessageListener<ByteArray> {
    private val logger = LoggerFactory.getLogger(PulsarProcessor::class.java)
    init {
        register()
    }
    private fun register() {
        pulsarTools.pulsarClient.newConsumer()
            .topic("$topicUriPrefix$topic")
            .subscriptionName(subscriptionName)
            .subscriptionType(SubscriptionType.Shared)
            .messageListener(this)
            .subscribe()
    }
    override fun received(consumer: Consumer<ByteArray>, msg: Message<ByteArray>) {
        try {
            val data = String(msg.data)
            logger.info("Pulsar message received - [$topic]")
            logger.debug("Pulsar message received - [$topic]: - $data")
            runBlocking { execute(jsonMapper.readValue(data, clazz.java)) }
            consumer.acknowledge(msg)
            logger.info("Pulsar message processed: [$topic]")
        } catch (exc: Exception) {
            logger.error("Error while processing pulsar message: [$topic]", exc)
            consumer.negativeAcknowledge(msg)
        }
    }
    abstract suspend fun execute(message: T)
}
@Component
data class PulsarTools(val pulsarClient: PulsarClient)
