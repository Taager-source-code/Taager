package com.taager.wallet.commands.application.models
import com.taager.wallet.commands.domain.models.wallet.EligibleAmount
import com.taager.wallet.commands.domain.models.wallet.ExpectedAmount
class MoveExpectedToEligibleAmountRequest(
    val transactionInfo: TransactionInfo,
    val expectedAmount: ExpectedAmount,
    val eligibleAmount: EligibleAmount
)