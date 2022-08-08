package com.taager.wallet.commands.infrastructure.processors.pulsar
import com.fasterxml.jackson.databind.ObjectMapper
import com.taager.wallet.commands.application.models.MoveExpectedToEligibleAmountRequest
import com.taager.wallet.commands.application.models.TransactionInfo
import com.taager.wallet.commands.application.usecases.MoveExpectedToEligible
import com.taager.wallet.commands.application.usecases.PlaceTransaction
import com.taager.wallet.commands.domain.models.transaction.Service
import com.taager.wallet.commands.domain.models.transaction.ServiceType
import com.taager.wallet.commands.domain.models.wallet.Currency
import com.taager.wallet.commands.domain.models.wallet.EligibleAmount
import com.taager.wallet.commands.domain.models.wallet.ExpectedAmount
import com.taager.wallet.commands.domain.models.wallet.TaagerId
import com.taager.wallet.commands.infrastructure.processors.pulsar.models.PlaceTransactionDto
import com.taager.wallet.sharedkernel.infrastructure.pulsar.PulsarProcessor
import com.taager.wallet.sharedkernel.infrastructure.pulsar.PulsarTools
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
@Component
class MoveExpectedToEligibleAmountProcessor(
    private val placeTransaction: PlaceTransaction,
    pulsarTools: PulsarTools,
    @Value("\${pulsar.wallet.topic-uri-prefix}") topicUriPrefix: String,
    @Value("\${pulsar.subscription}") subscription: String,
    @Value("\${pulsar.wallet.topic.release-expected-amount}") topic: String,
    jsonMapper: ObjectMapper
) : PulsarProcessor<PlaceTransactionDto>(
    PlaceTransactionDto::class,
    pulsarTools,
    topicUriPrefix,
    topic,
    subscription,
    jsonMapper
) {
    override suspend fun execute(message: PlaceTransactionDto) {
        val request = toDomain(message)
        placeTransaction.execute(request.transactionInfo, MoveExpectedToEligible(request))
    }
    private fun toDomain(message: PlaceTransactionDto): MoveExpectedToEligibleAmountRequest =
        MoveExpectedToEligibleAmountRequest(
            transactionInfo = TransactionInfo(
                taagerId = TaagerId(message.taagerId),
                currency = Currency(message.currency.value),
                service = Service(
                    ServiceType.fromString(message.serviceType.value),
                    message.serviceTransactionId,
                    message.serviceSubType
                )
            ),
            expectedAmount = ExpectedAmount(message.amount),
            eligibleAmount = EligibleAmount(message.amount)
        )
}
