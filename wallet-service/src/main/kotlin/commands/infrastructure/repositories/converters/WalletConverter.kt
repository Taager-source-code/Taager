package com.taager.wallet.commands.infrastructure.repositories.converters
import com.taager.wallet.commands.domain.models.wallet.*
import com.taager.wallet.common.infrastructure.db.models.WalletDbo
import java.math.BigDecimal
class WalletConverter {
    companion object {
        fun toDomain(walletDbo: WalletDbo, elAmount: BigDecimal, exAmount: BigDecimal): Wallet {
            return Wallet(
                walletId = WalletId(walletDbo.id),
                taagerId = TaagerId(walletDbo.taagerId),
                currency = Currency(walletDbo.currency),
                eligibleAmount = EligibleAmount(elAmount),
                expectedAmount = ExpectedAmount(exAmount)
            )
        }
        fun toWalletDbo(wallet: Wallet): WalletDbo {
            return WalletDbo(
                id = wallet.walletId.value,
                taagerId = wallet.taagerId.value,
                currency = wallet.currency.isoCode
            )
        }
    }
}