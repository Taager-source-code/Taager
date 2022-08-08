package com.taager.wallet.commands.infrastructure.repositories.converters
import com.taager.wallet.commands.domain.models.transaction.CreditTransaction
import com.taager.wallet.commands.domain.models.transaction.DebitTransaction
import com.taager.wallet.commands.domain.models.transaction.Transaction
import com.taager.wallet.commands.domain.models.wallet.EligibleAmount
import com.taager.wallet.commands.domain.models.wallet.ExpectedAmount
import com.taager.wallet.common.infrastructure.db.constants.AmountTypeDbo
import com.taager.wallet.common.infrastructure.db.constants.TransactionTypeDbo
import com.taager.wallet.common.infrastructure.db.models.TransactionDbo
import java.sql.Timestamp
import java.time.LocalDateTime
import java.util.*
class TransactionConverter {
    companion object {
        fun toDbo(transaction: Transaction, walletId: UUID): TransactionDbo {
            return when (transaction) {
                is CreditTransaction ->
                    when (transaction.amount) {
                        is EligibleAmount ->
                            getTransactionDbo(
                                transaction,
                                walletId,
                                AmountTypeDbo.ELIGIBLE.id,
                                TransactionTypeDbo.CREDIT.id
                            )
                        is ExpectedAmount ->
                            getTransactionDbo(
                                transaction,
                                walletId,
                                AmountTypeDbo.EXPECTED.id,
                                TransactionTypeDbo.CREDIT.id
                            )
                    }
                is DebitTransaction ->
                    return when (transaction.amount) {
                        is EligibleAmount ->
                            getTransactionDbo(
                                transaction,
                                walletId,
                                AmountTypeDbo.ELIGIBLE.id,
                                TransactionTypeDbo.DEBIT.id
                            )
                        is ExpectedAmount ->
                            getTransactionDbo(
                                transaction,
                                walletId,
                                AmountTypeDbo.EXPECTED.id,
                                TransactionTypeDbo.DEBIT.id
                            )
                    }
            }
        }
        private fun getTransactionDbo(
            transaction: Transaction,
            walletId: UUID,
            amountType: String,
            transactionType: String
        ): TransactionDbo {
            return TransactionDbo(
                id = transaction.id.value, walletId = walletId,
                amount = transaction.amount.value,
                amountType = amountType,
                type = transactionType,
                serviceType = transaction.service.type.name.uppercase(),
                serviceSubType = transaction.service.subType,
                serviceTransactionId = transaction.service.transactionId,
                operationId = UUID.randomUUID(), //please check this
                createdAt = Timestamp.valueOf(LocalDateTime.now())
            )
        }
    }
}
