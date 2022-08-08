package com.taager.wallet.queries.application.models
import com.taager.wallet.commands.domain.models.wallet.Currency
import com.taager.wallet.commands.domain.models.wallet.WalletId
import java.math.BigDecimal
data class MerchantWallet(
    val walletId: WalletId,
    val currency: Currency,
    val amount: BigDecimal,
    val expectedAmount: BigDecimal
)
