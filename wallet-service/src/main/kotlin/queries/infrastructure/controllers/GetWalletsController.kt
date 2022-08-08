package com.taager.wallet.queries.infrastructure.controllers
import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.taager.wallet.commands.domain.models.wallet.Currency
import com.taager.wallet.openapi.api.GetWalletsApi
import com.taager.wallet.openapi.model.CurrencyDTO
import com.taager.wallet.openapi.model.GetMerchantWalletsResponseDTO
import com.taager.wallet.openapi.model.MerchantWalletDTO
import com.taager.wallet.queries.application.models.MerchantWallet
import com.taager.wallet.queries.application.usecases.GetMerchantWallets
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
@RestController
class GetWalletsController(private val getMerchantWallets: GetMerchantWallets) : GetWalletsApi {
    override suspend fun getWallets(
        taagerId: Int, currency: CurrencyDTO?
    ): ResponseEntity<GetMerchantWalletsResponseDTO> {
        return when (val getMerchantWalletsResponse = getMerchantWallets.execute(taagerId, map(currency))) {
            is Err -> ResponseEntity(
                GetMerchantWalletsResponseDTO(wallets = emptyList()),
                HttpStatus.OK
            ) //TODO: tackle better through advice, out of scope
            is Ok -> ResponseEntity(
                GetMerchantWalletsResponseDTO(wallets = map(getMerchantWalletsResponse.value)),
                HttpStatus.OK
            )
        }
    }
    private fun map(currency: CurrencyDTO?): Currency? =
        if (currency != null) {
            Currency(currency.value)
        } else {
            null
        }
    private fun map(wallets: List<MerchantWallet>): List<MerchantWalletDTO> =
        wallets.map { map(it) }
    private fun map(wallet: MerchantWallet): MerchantWalletDTO =
        MerchantWalletDTO(
            walletId = wallet.walletId.value.toString(),
            currency = wallet.currency.isoCode,
            amount = wallet.amount,
            expectedAmount = wallet.expectedAmount
        )
}
