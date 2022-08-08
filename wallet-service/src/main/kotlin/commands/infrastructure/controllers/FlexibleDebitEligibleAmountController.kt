package com.taager.wallet.commands.infrastructure.controllers
import com.taager.wallet.commands.application.models.FlexibleDebitEligibleAmountRequest
import com.taager.wallet.commands.application.models.TransactionInfo
import com.taager.wallet.commands.application.usecases.FlexibleDebitEligibleAmount
import com.taager.wallet.commands.application.usecases.PlaceTransaction
import com.taager.wallet.commands.domain.exceptions.InvalidAmountException
import com.taager.wallet.commands.domain.models.transaction.Service
import com.taager.wallet.commands.domain.models.transaction.ServiceType
import com.taager.wallet.commands.domain.models.wallet.Currency
import com.taager.wallet.commands.domain.models.wallet.EligibleAmount
import com.taager.wallet.commands.domain.models.wallet.TaagerId
import com.taager.wallet.openapi.api.FlexibleDebitEligibleAmountApi
import com.taager.wallet.openapi.model.ErrorDto
import com.taager.wallet.openapi.model.PlaceTransactionDTO
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.LocalTime
@RestController
class FlexibleDebitEligibleAmountController(private val placeTransaction: PlaceTransaction) :
    FlexibleDebitEligibleAmountApi {
    override suspend fun flexibleDebitEligibleAmount(
        taagerId: Int,
        placeTransactionDTO: PlaceTransactionDTO
    ): ResponseEntity<Unit> {
        val request = map(placeTransactionDTO, taagerId)
        placeTransaction.execute(request.transactionInfo, FlexibleDebitEligibleAmount(request))
        return ResponseEntity(HttpStatus.OK)
    }
    private fun map(dto: PlaceTransactionDTO, taagerId: Int): FlexibleDebitEligibleAmountRequest =
        FlexibleDebitEligibleAmountRequest(
            transactionInfo = TransactionInfo(
                taagerId = TaagerId(taagerId),
                currency = Currency(dto.currency.value),
                service = Service(
                    ServiceType.fromString(dto.serviceType.toString()),
                    dto.serviceTransactionId, dto.serviceSubType
                )
            ),
            eligibleAmount = EligibleAmount(dto.amount)
        )
}
@RestControllerAdvice(basePackageClasses = [FlexibleDebitEligibleAmountController::class])
class FlexibleDebitEligibleAmountControllerAdvice {
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidAmountException::class)
    fun invalidAmountProvided(invalidAmountException: InvalidAmountException): ResponseEntity<ErrorDto> {
        return ResponseEntity(
            ErrorDto(
                timestamp = LocalTime.now().toString(),
                message = invalidAmountException.message
            ),
            HttpStatus.BAD_REQUEST
        )
    }
}
