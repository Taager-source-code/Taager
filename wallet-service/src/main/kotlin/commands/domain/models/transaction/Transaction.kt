package com.taager.wallet.commands.domain.models.transaction
import com.taager.wallet.commands.domain.models.base.Entity
import com.taager.wallet.commands.domain.models.wallet.Amount
import java.util.*
sealed class Transaction private constructor(
    transactionId: TransactionId,
    open val amount: Amount,
    open val service: Service,
) : Entity<TransactionId>(transactionId)
data class DebitTransaction(
    val transactionId: TransactionId = TransactionId(UUID.randomUUID()),
    override val amount: Amount,
    override val service: Service,
) : Transaction(
    transactionId,
    amount,
    service
)
data class CreditTransaction(
    val transactionId: TransactionId = TransactionId(UUID.randomUUID()),
    override val amount: Amount,
    override val service: Service,
) : Transaction(
    transactionId,
    amount,
    service
)