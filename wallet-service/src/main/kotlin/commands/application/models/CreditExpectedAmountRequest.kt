package com.taager.wallet.commands.application.models
import com.taager.wallet.commands.domain.models.wallet.ExpectedAmount
data class CreditExpectedAmountRequest(
    val transactionInfo: TransactionInfo,
    val expectedAmount: ExpectedAmount
)