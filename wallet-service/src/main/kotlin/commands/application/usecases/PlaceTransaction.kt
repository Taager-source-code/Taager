package com.taager.wallet.commands.application.usecases
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.taager.wallet.commands.application.models.*
import com.taager.wallet.commands.domain.contracts.WalletRepo
import com.taager.wallet.commands.domain.models.wallet.Wallet
import org.springframework.stereotype.Service
@Service
class PlaceTransaction(private val walletRepo: WalletRepo) {
    suspend fun execute(info: TransactionInfo, executor: PlaceTransactionExecutor): Result<Unit, Throwable> {
        val wallet = walletRepo
            .getByTaagerIdAndCurrency(info.taagerId, info.currency)
            ?: Wallet.new(info.currency, info.taagerId)
        executor.execute(wallet)
        walletRepo.save(wallet)
        return Ok(Unit)
    }
}
interface PlaceTransactionExecutor {
    fun execute(wallet: Wallet)
}
class MoveExpectedToEligible(private val request: MoveExpectedToEligibleAmountRequest) : PlaceTransactionExecutor {
    override fun execute(wallet: Wallet) {
        wallet.debitExpected(request.expectedAmount, request.transactionInfo.service)
        wallet.creditEligible(request.eligibleAmount, request.transactionInfo.service)
    }
}
class CreditEligibleAmount(private val request: CreditEligibleAmountRequest) : PlaceTransactionExecutor {
    override fun execute(wallet: Wallet) {
        wallet.creditEligible(request.eligibleAmount, request.transactionInfo.service)
    }
}
class CreditExpectedAmount(private val request: CreditExpectedAmountRequest) : PlaceTransactionExecutor {
    override fun execute(wallet: Wallet) {
        wallet.creditExpected(request.expectedAmount, request.transactionInfo.service)
    }
}
class DebitExpectedAmount(private val request: DebitExpectedAmountRequest) : PlaceTransactionExecutor {
    override fun execute(wallet: Wallet) {
        wallet.debitExpected(request.expectedAmount, request.transactionInfo.service)
    }
}
class DebitEligibleAmount(private val request: DebitEligibleAmountRequest) : PlaceTransactionExecutor {
    override fun execute(wallet: Wallet) {
        wallet.debitEligible(request.eligibleAmount, request.transactionInfo.service)
    }
}
class FlexibleDebitEligibleAmount(private val request: FlexibleDebitEligibleAmountRequest) : PlaceTransactionExecutor {
    override fun execute(wallet: Wallet) {
        wallet.flexibleDebitEligible(request.eligibleAmount, request.transactionInfo.service)
    }
}
