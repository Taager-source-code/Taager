package com.taager.wallet.commands.domain.models.wallet
import com.taager.wallet.commands.domain.events.TransactionCreated
import com.taager.wallet.commands.domain.events.WalletAmountChanged
import com.taager.wallet.commands.domain.exceptions.InsufficientAmountException
import com.taager.wallet.commands.domain.models.base.AggregateRoot
import com.taager.wallet.commands.domain.models.transaction.CreditTransaction
import com.taager.wallet.commands.domain.models.transaction.DebitTransaction
import com.taager.wallet.commands.domain.models.transaction.Service
import com.taager.wallet.commands.domain.models.transaction.Transaction
import java.math.BigDecimal
import java.util.*
data class Wallet(
    val walletId: WalletId,
    val taagerId: TaagerId,
    val currency: Currency,
    private var expectedAmount: ExpectedAmount,
    private var eligibleAmount: EligibleAmount,
) : AggregateRoot<WalletId>(walletId) {
    // region variables
    private val transactions: MutableList<Transaction> = mutableListOf()
    //endregion
    //region public methods
    companion object {
        fun new(currency: Currency, taagerId: TaagerId): Wallet {
            return Wallet(
                walletId = WalletId(UUID.randomUUID()),
                taagerId = taagerId,
                expectedAmount = ExpectedAmount.ZERO,
                eligibleAmount = EligibleAmount.ZERO,
                currency = currency
            )
        }
    }
    fun creditEligible(amount: EligibleAmount, service: Service) {
        this.eligibleAmount = this.eligibleAmount + amount
        newTransaction(CreditTransaction(amount = amount, service = service))
    }
    fun debitEligible(amountToDebit: EligibleAmount, service: Service) {
        assertSufficientAmount(this.eligibleAmount - amountToDebit)
        this.eligibleAmount = this.eligibleAmount - amountToDebit
        newTransaction(DebitTransaction(amount = amountToDebit, service = service))
    }
    fun flexibleDebitEligible(amount: EligibleAmount, service: Service) {
        this.eligibleAmount = this.eligibleAmount - amount
        newTransaction(DebitTransaction(amount = amount, service = service))
    }
    fun creditExpected(amount: ExpectedAmount, service: Service) {
        this.expectedAmount = this.expectedAmount + amount
        newTransaction(CreditTransaction(amount = amount, service = service))
    }
    fun debitExpected(amountToDebit: ExpectedAmount, service: Service) {
        assertSufficientAmount(this.expectedAmount - amountToDebit)
        this.expectedAmount = this.expectedAmount - amountToDebit
        newTransaction(DebitTransaction(amount = amountToDebit, service = service))
    }
    fun moveExpectedToEligible(amount: ExpectedAmount, service: Service) {
        debitExpected(amount, service)
        creditEligible(EligibleAmount(amount.value), service)
    }
    fun getTransactions(): List<Transaction> {
        return Collections.unmodifiableList(transactions)
    }
    fun getExpectedAmount() = expectedAmount
    fun getEligibleAmount() = eligibleAmount
    //endregion
    // region private methods
    private fun newTransaction(transaction: Transaction) {
        this.transactions.add(transaction)
        raiseEvent(TransactionCreated(transaction))
        raiseWalletAmountChanged()
    }
    private fun raiseWalletAmountChanged() {
        occurredEvents.removeIf { it is WalletAmountChanged }
        raiseEvent(WalletAmountChanged(this))
    }
    private fun assertSufficientAmount(amount: Amount) {
        if (amount.value < BigDecimal.ZERO)
            throw InsufficientAmountException()
    }
    //endregion
}