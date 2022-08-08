package com.taager.wallet.queries.application.contracts
import com.taager.wallet.commands.domain.models.wallet.Currency
import com.taager.wallet.queries.application.models.MerchantWallet
interface WalletRepo {
    suspend fun getMerchantWallets(taagerId: Int, currency: Currency?): List<MerchantWallet>
}
