 package com.taager.travolta.sharedkernel.infrastructure.pulsar
import org.apache.pulsar.client.api.Producer
import org.apache.pulsar.client.impl.schema.JSONSchema
import java.util.UUID
import kotlin.reflect.KClass
class PulsarPublisher<T : Any>(
    private val clazz: KClass<T>,
    private val pulsarTools: PulsarTools,
    private val topicUriPrefix: String,
    private val topic: String
) {
    private val publisher: Producer<T> by lazy {
        pulsarTools.pulsarClient.newProducer(JSONSchema.of(clazz.java))
            .producerName("travolta-service-${UUID.randomUUID()}")
            .topic("$topicUriPrefix$topic")
            .create()
    }
    fun publish(message: T) {
        publisher.send(message)
    }
}
