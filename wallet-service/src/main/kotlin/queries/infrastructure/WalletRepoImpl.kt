package com.taager.wallet.queries.infrastructure.repositories
import com.taager.wallet.commands.domain.models.wallet.Currency
import com.taager.wallet.common.infrastructure.db.access.TransactionDao
import com.taager.wallet.common.infrastructure.db.access.WalletDao
import com.taager.wallet.common.infrastructure.db.models.WalletDbo
import com.taager.wallet.queries.application.contracts.WalletRepo
import com.taager.wallet.queries.application.models.MerchantWallet
import com.taager.wallet.queries.infrastructure.repositories.converters.MerchantWalletConverter
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.onEach
import org.springframework.stereotype.Component
@Component("queryWalletRepoImpl")
class WalletRepoImpl(private val walletDao: WalletDao, private val transactionDao: TransactionDao) : WalletRepo {
    override suspend fun getMerchantWallets(taagerId: Int, currency: Currency?): List<MerchantWallet> {
        if (currency !== null) {
            walletDao.findOneByTaagerIdAndCurrency(taagerId = taagerId, currency = currency.isoCode)
                ?.let { walletDbo ->
                    return listOf(mapTransactionToWallet(walletDbo))
                }
        }
        val listOfWallets = mutableListOf<MerchantWallet>()
        walletDao.findAllByTaagerId(taagerId)
            .onEach { walletDbo ->
                listOfWallets.add(mapTransactionToWallet(walletDbo))
            }.collect()
        return listOfWallets
    }
    private suspend fun mapTransactionToWallet(walletDbo: WalletDbo): MerchantWallet {
        val amountsDbo = transactionDao.findAmountsByWalletId(walletId = walletDbo.id)
        return MerchantWalletConverter.toDomain(walletDbo, amountsDbo.expectedAmount, amountsDbo.eligibleAmount)
    }
}
