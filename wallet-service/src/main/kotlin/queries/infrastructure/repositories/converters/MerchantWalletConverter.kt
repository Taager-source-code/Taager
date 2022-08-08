package com.taager.wallet.queries.infrastructure.repositories.converters
import com.taager.wallet.commands.domain.models.wallet.Currency
import com.taager.wallet.commands.domain.models.wallet.WalletId
import com.taager.wallet.common.infrastructure.db.models.WalletDbo
import com.taager.wallet.queries.application.models.MerchantWallet
import java.math.BigDecimal
class MerchantWalletConverter {
    companion object {
        fun toDomain(walletDbo: WalletDbo, expectedAmount: BigDecimal, eligibleAmount: BigDecimal): MerchantWallet {
            return MerchantWallet(
                walletId = WalletId(walletDbo.id),
                currency = Currency(walletDbo.currency),
                amount = eligibleAmount,
                expectedAmount = expectedAmount
            )
        }
    }
}