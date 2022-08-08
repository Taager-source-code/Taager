package com.taager.wallet.commands.application.models
import com.taager.wallet.commands.domain.models.wallet.EligibleAmount
data class FlexibleDebitEligibleAmountRequest(
    val transactionInfo: TransactionInfo,
    val eligibleAmount: EligibleAmount
)