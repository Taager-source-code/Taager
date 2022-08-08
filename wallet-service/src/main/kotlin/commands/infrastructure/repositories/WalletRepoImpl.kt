package com.taager.wallet.commands.infrastructure.repositories
import com.taager.wallet.commands.domain.contracts.WalletRepo
import com.taager.wallet.commands.domain.models.wallet.Currency
import com.taager.wallet.commands.domain.models.wallet.TaagerId
import com.taager.wallet.commands.domain.models.wallet.Wallet
import com.taager.wallet.commands.infrastructure.repositories.converters.TransactionConverter
import com.taager.wallet.commands.infrastructure.repositories.converters.WalletConverter
import com.taager.wallet.common.infrastructure.db.access.TransactionDao
import com.taager.wallet.common.infrastructure.db.access.WalletDao
import com.taager.wallet.common.infrastructure.db.models.TransactionDbo
import kotlinx.coroutines.flow.collect
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
@Component
class WalletRepoImpl(
    private val walletDao: WalletDao,
    private val transactionDao: TransactionDao
) : WalletRepo {
    private val logger: Logger = LoggerFactory.getLogger(WalletRepoImpl::class.java)
    override suspend fun getByTaagerIdAndCurrency(taagerId: TaagerId, currency: Currency): Wallet? {
        val walletDbo =  walletDao.findOneByTaagerIdAndCurrency(taagerId = taagerId.value, currency = currency.isoCode) ?: return null
        val amountsDbo = transactionDao.findAmountsByWalletId(walletId = walletDbo.id)
        return WalletConverter.toDomain(walletDbo, elAmount = amountsDbo.eligibleAmount, exAmount = amountsDbo.expectedAmount)
    }
    override suspend fun save(wallet: Wallet) {
        if (this.walletDao.findOneByTaagerIdAndCurrency(wallet.taagerId.value, wallet.currency.isoCode) == null) {
            logger.debug("saving wallet: {} for merchant: {} {}", wallet, wallet.taagerId, wallet.currency)
            walletDao.save(WalletConverter.toWalletDbo(wallet))
        }
        val transactions: Set<TransactionDbo> = wallet.getTransactions().map {
            TransactionConverter.toDbo(it, walletId = wallet.walletId.value)
        }.toSet()
       if(transactions.isNotEmpty()) {
           logger.debug("saving transactions: {} for merchant: {}", transactions, wallet.taagerId)
           transactionDao.saveAll(transactions).collect()
       }
    }
}