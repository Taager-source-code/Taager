package com.taager.wallet.commands.infrastructure.processors.pulsar
import com.fasterxml.jackson.databind.ObjectMapper
import com.taager.wallet.commands.application.models.CreditEligibleAmountRequest
import com.taager.wallet.commands.application.models.TransactionInfo
import com.taager.wallet.commands.application.usecases.CreditEligibleAmount
import com.taager.wallet.commands.application.usecases.PlaceTransaction
import com.taager.wallet.commands.domain.models.transaction.Service
import com.taager.wallet.commands.domain.models.transaction.ServiceType
import com.taager.wallet.commands.domain.models.wallet.Currency
import com.taager.wallet.commands.domain.models.wallet.EligibleAmount
import com.taager.wallet.commands.domain.models.wallet.TaagerId
import com.taager.wallet.commands.infrastructure.processors.pulsar.models.PlaceTransactionDto
import com.taager.wallet.sharedkernel.infrastructure.pulsar.PulsarProcessor
import com.taager.wallet.sharedkernel.infrastructure.pulsar.PulsarTools
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
@Component
class CreditAmountProcessor(
    private val placeTransaction: PlaceTransaction,
    pulsarTools: PulsarTools,
    @Value("\${pulsar.wallet.topic-uri-prefix}") topicUriPrefix: String,
    @Value("\${pulsar.subscription}") subscription: String,
    @Value("\${pulsar.wallet.topic.credit-eligible-amount}") topic: String,
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
        val creditEligibleAmountRequest = toDomain(message)
        placeTransaction.execute(
            creditEligibleAmountRequest.transactionInfo,
            CreditEligibleAmount(creditEligibleAmountRequest)
        )
    }
    private fun toDomain(message: PlaceTransactionDto): CreditEligibleAmountRequest =
        CreditEligibleAmountRequest(
            transactionInfo = TransactionInfo(
                taagerId = TaagerId(message.taagerId),
                currency = Currency(message.currency.value),
                service = Service(
                    ServiceType.fromString(message.serviceType.value),
                    message.serviceTransactionId,
                    message.serviceSubType
                )
            ),
            eligibleAmount = EligibleAmount(message.amount)
        )
}
