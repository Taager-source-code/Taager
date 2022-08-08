package com.taager.wallet.commands.domain.contracts
import com.taager.wallet.commands.domain.models.wallet.Currency
import com.taager.wallet.commands.domain.models.wallet.TaagerId
import com.taager.wallet.commands.domain.models.wallet.Wallet
interface WalletRepo
{
    suspend fun getByTaagerIdAndCurrency(taagerId: TaagerId, currency: Currency): Wallet?
    suspend fun save(wallet: Wallet)
}