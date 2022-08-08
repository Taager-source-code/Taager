package com.taager.wallet.queries.application.usecases
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.taager.wallet.commands.domain.models.wallet.Currency
import com.taager.wallet.queries.application.contracts.WalletRepo
import com.taager.wallet.queries.application.models.MerchantWallet
import org.springframework.stereotype.Component
@Component
class GetMerchantWallets(private val walletRepo: WalletRepo) {
    suspend fun execute(taagerId: Int, currency: Currency?): Result<List<MerchantWallet>, Throwable> {
        return Ok(walletRepo.getMerchantWallets(taagerId, currency))
    }
}
