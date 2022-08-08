package com.taager.travolta.common.reporting.useractions.kinesis
import com.amazonaws.services.kinesisfirehose.AmazonKinesisFirehose
import com.amazonaws.services.kinesisfirehose.model.PutRecordRequest
import com.amazonaws.services.kinesisfirehose.model.Record
import com.fasterxml.jackson.databind.ObjectMapper
import com.taager.travolta.common.featureflags.FeatureManager
import com.taager.travolta.common.reporting.useractions.UserActionPublisher
import com.taager.travolta.common.reporting.useractions.domain.UserAction
import net.logstash.logback.argument.StructuredArguments.keyValue
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Service
import java.nio.ByteBuffer
@Service
@ConditionalOnProperty(prefix = "useractions.kinesis.publish", name = ["enabled"])
class KinesisUserActionPublisher(
    private val kinesisFirehose: AmazonKinesisFirehose,
    private val objectMapper: ObjectMapper,
    private val featureManager: FeatureManager,
    private val kinesisUserActionConverter: KinesisUserActionConverter,
    @Value("\${useractions.kinesis.publish.stream}") private val deliveryStreamName: String
) : UserActionPublisher {
    private val log = LoggerFactory.getLogger(UserActionPublisher::class.java)
    override fun publish(userAction: UserAction) {
        try {
            if (featureManager.isKinesisEnabled(userAction.userId)) {
                val convertedUserAction = kinesisUserActionConverter.convert(userAction)
                val payload = objectMapper.writeValueAsString(convertedUserAction) + "\n"
                log.info(
                    "Publishing data to kinesis: $payload",
                    keyValue("deliveryStream", deliveryStreamName)
                )
                val record = Record().withData(ByteBuffer.wrap(payload.toByteArray()))
                val request = PutRecordRequest().withDeliveryStreamName(deliveryStreamName).withRecord(record)
                kinesisFirehose.putRecord(request)
            } else {
                log.info("Kinesis publishing disabled", keyValue("deliveryStream", deliveryStreamName))
            }
        } catch (e: Exception) {
            log.error("Error occurred while publishing to kinesis: ", e)
        }
    }
}
