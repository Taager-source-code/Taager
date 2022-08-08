package com.taager.wallet.commands.application.models
import com.taager.wallet.commands.domain.models.transaction.Service
import com.taager.wallet.commands.domain.models.wallet.Currency
import com.taager.wallet.commands.domain.models.wallet.TaagerId
class TransactionInfo(
    val taagerId: TaagerId,
    val currency: Currency,
    val service: Service
)